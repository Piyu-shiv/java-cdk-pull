import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { CustomResource } from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


export class LogForwardingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Destination log group
    const logGroup = new logs.LogGroup(this, 'CentralLogGroup', {
      logGroupName: '/central/forwarded-logs-v2',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Role that source Lambda will assume
    const assumeRole = new iam.Role(this, 'CrossAccountWriteRole', {
      roleName: 'CrossAccountLogWriteRole',
      assumedBy: new iam.AccountPrincipal('580337528372'), // Replace
    });

    assumeRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
      resources: [logGroup.logGroupArn],
    }));

    // Lambda that sets the CloudWatch Logs resource policy
    const policySetter = new lambda.Function(this, 'PolicySetterLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'resource-policy.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    });

    new CustomResource(this, 'LogsResourcePolicy', {
      serviceToken: new cr.Provider(this, 'PolicyProvider', {
        onEventHandler: policySetter,
      }).serviceToken,
    });
  }
}
