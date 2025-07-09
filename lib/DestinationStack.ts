// // file: lib/destination-stack.ts
// import * as cdk from 'aws-cdk-lib';
// import * as logs from 'aws-cdk-lib/aws-logs';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as cr from 'aws-cdk-lib/custom-resources';
// import * as path from 'path';

// export class DestinationStack extends cdk.Stack {
//   constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const sourceAccountId = '580337528372'; // Replace this

//     const centralLogGroup = new logs.LogGroup(this, 'CentralLogGroup', {
//       logGroupName: '/central/logs/streamed',
//       retention: logs.RetentionDays.FIVE_MONTHS,
//     });

//     const destinationRole = new iam.Role(this, 'CrossAccountLogRole', {
//       assumedBy: new iam.AccountPrincipal(sourceAccountId),
//     });

//     centralLogGroup.grantWrite(destinationRole); // Allow the role to write logs

//     const destination = new logs.CfnDestination(this, 'CrossAccountDestination', {
//       destinationName: 'FromSourceAccount',
//       roleArn: destinationRole.roleArn,
//       targetArn: centralLogGroup.logGroupArn,
//     });

//     // Allow source account to put subscription filter
//     new logs.CfnDestination(this, 'CrossAccountDestination', {
//         destinationName: 'FromSourceAccount',
//         roleArn: destinationRole.roleArn, // REQUIRED
//         targetArn: centralLogGroup.logGroupArn, // REQUIRED
//         // iam: {
//         //   Version: '2012-10-17',
//         //   Statement: [
//         //     {
//         //       Effect: 'Allow',
//         //       Principal: {
//         //         AWS: `arn:aws:iam::${sourceAccountId}:root`,
//         //       },
//         //       Action: 'logs:PutSubscriptionFilter',
//         //       Resource: '*',
//         //     },
//         //   ],
//         // },
//       });
//     }}