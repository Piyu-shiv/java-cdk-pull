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
function test() {
	const configFile = fs.readFileSync(
		'D://work//typescript//cdk-pull-dashboard//config//consolidated-dashboard.yaml',
		'utf8'
	);
	const config = yaml.load(configFile) as DashboardYaml;

	config.accounts.forEach((account: AccountConfig) => {
		// console.log(account)
		// console.log('printing account')
		const customNs = account.customMetricsNameSpace || {};
		// console.log(defaultNs)

		Object.entries(customNs).forEach(([namespace, groupName]) => {
            // console.log(namespace,'dd')
			// console.log(groupName, 'heyyyy');
			Object.values(groupName).forEach((metrics: MetricDefinition[]) => {
                console.log(metrics,'ae')
				// metrics.forEach((metricDef) => {
				// 	console.log(namespace);
				// 	console.log('****************************************');
				// 	console.log(metricDef);
				// });
			});
		});
	});
}

test();
