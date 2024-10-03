import fs from 'fs';
import yaml from 'js-yaml';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const confidentialityAgreementContent = fs.readFileSync('confidentiality_agreement.yaml', 'utf8');
  const confidentialityAgreement = yaml.load(confidentialityAgreementContent);
  res.status(200).json(confidentialityAgreement);
}

