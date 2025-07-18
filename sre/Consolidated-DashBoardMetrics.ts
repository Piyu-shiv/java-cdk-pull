import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Interfaces
interface MetricDefinition {
  metricName: string;
  dimensions: Record<string, string>;
  stat: string;
  title: string;
  period?: number;
}

interface DefaultMetricNamespace {
  [namespace: string]: {
    [groupName: string]: MetricDefinition[];
  };
}

interface CustomMetricNamespace {
  [namespace: string]: {
    [groupName: string]: MetricDefinition[];
  };
}

interface AccountConfig {
  id: number;
  dashBoardName: string;
  nameSpace?: DefaultMetricNamespace;
  customMetricsNameSpace?: CustomMetricNamespace;
}

interface DashboardYaml {
  accounts: AccountConfig[];
}

export class DashboardStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const configFile = fs.readFileSync('config/consolidated-dashboard.yaml', 'utf8');
    const config = yaml.load(configFile) as DashboardYaml;

    config.accounts.forEach((account: AccountConfig) => {
      const dashboard = new cloudwatch.Dashboard(this, `${account.dashBoardName}-Dashboard`, {
        dashboardName: account.dashBoardName,
      });

      // 🔹 Handle Default Metrics
      const defaultNs = account.nameSpace || {};
      Object.entries(defaultNs).forEach(([namespace, groupObj]) => {
        Object.values(groupObj).forEach((metricList: MetricDefinition[]) => {
          metricList.forEach((metricDef) => {
            const metric = new cloudwatch.Metric({
              ...metricDef,
              namespace,
              dimensionsMap: metricDef.dimensions,
              period: cdk.Duration.seconds(metricDef.period ?? 60),
            });

            dashboard.addWidgets(
              new cloudwatch.GraphWidget({
                title: metricDef.title,
                width: 12,
                left: [metric],
              })
            );
          });
        });
      });

      // 🔸 Handle Custom Metrics
      const customNs = account.customMetricsNameSpace || {};
      Object.entries(customNs).forEach(([namespace, groupObj]) => {
        Object.values(groupObj).forEach((metricList: MetricDefinition[]) => {
          metricList.forEach((metricDef) => {
            const metric = new cloudwatch.Metric({
              ...metricDef,
              namespace,
              dimensionsMap: metricDef.dimensions,
              period: cdk.Duration.seconds(metricDef.period ?? 60),
            });

            dashboard.addWidgets(
              new cloudwatch.GraphWidget({
                title: metricDef.title,
                width: 12,
                left: [metric],
              })
            );
          });
        });
      });
    });
  }
}
