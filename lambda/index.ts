import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

export const handler = async () => {
  const sts = new STSClient({});
  const { Credentials } = await sts.send(
    new AssumeRoleCommand({
      RoleArn: "arn:aws:iam::<580337528372>:role/CrossAccountCloudWatchAccessRole",
      RoleSessionName: "AssumeCWSession"
    })
  );

  const cloudwatch = new CloudWatchClient({
    region: 'ap-south-1',
    credentials: {
      accessKeyId: 'AKIAYOHWP5Y2N3XOXBRY',
      secretAccessKey: '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',
      sessionToken:'arn:aws:iam::580337528372:u2f/root/piyush-aws-QDOB3CR3JVAITAS4XAO2YWIXWM',
    }
  });

  const result = await cloudwatch.send(
    new GetMetricDataCommand({
      StartTime: new Date(Date.now() - 3600000),
      EndTime: new Date(),
      MetricDataQueries: [
        {
          Id: "cpuUtil",
          MetricStat: {
            Metric: {
              Namespace: "AWS/EC2",
              MetricName: "CPUUtilization",
              Dimensions: [{ Name: "InstanceId", Value: "i-0a378d9a314c56de5" }]
            },
            Period: 300,
            Stat: "Average"
          },
          ReturnData: true
        }
      ]
    })
  );

  console.log("Metric Result:", JSON.stringify(result, null, 2));
};
