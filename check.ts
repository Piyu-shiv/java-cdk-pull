import * as dotenv from 'dotenv';
dotenv.config({ path: 'D://work//typescript//cdk-pull-dashboard//.env'});

console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCOUNT_ID:', process.env.AWS_ACCOUNT_ID);