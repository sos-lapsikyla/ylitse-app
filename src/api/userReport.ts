import * as http from '../lib/http';

import * as authApi from './auth';
import * as config from './config';

export type AppReport = {
  reportedId: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  reportedMessageId: string;
};

type ApiReport = {
  reported_user_id: string;
  contact_email: string;
  contact_phone: string;
  report_reason: string;
  reported_message_id: string;
};

const toApiReport = ({
  reportedId,
  contactEmail,
  contactPhone,
  description,
  reportedMessageId,
}: AppReport): ApiReport => ({
  reported_user_id: reportedId,
  contact_email: contactEmail,
  contact_phone: contactPhone,
  report_reason: description,
  reported_message_id: reportedMessageId,
});

export const reportUser =
  (report: AppReport) => (token: authApi.AccessToken) => {
    const url = `${config.baseUrl}/reports/${report.reportedId}`;

    return http.post(url, toApiReport(report), {
      headers: authApi.authHeader(token),
    });
  };
