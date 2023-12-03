export function meetingInviteHtml(param) {
  return `<head>
    <meta charset="UTF-8">
    <title>Case Update Mail</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Rubik&amp;display=swap" rel="stylesheet">
    <style>
        img {
            max-width: 100%;
        }

        *,
        :after,
        :before {
            box-sizing: border-box;
        }

        body {
            font-family: Rubik;
            background: #F7F9FB;
        }

        table {
            border-collapse: collapse;
        }
    </style>
</head>

<body>
    <div style='width:610px;margin:20px auto;border:1px solid #ece9f1;border-radius:10px;margin-bottom:25px'>
        <table style='padding:15px;'>
            <thead>
                <tr>
                    <td align='center' style='padding-top:50px;padding-bottom:50px'>
                        <div style='padding-bottom:20px'><img
                                src='https://www.dentallive.com/assets/images/Logo_Dark.png' alt='logo'
                                height='25px' width='180px'></div>
                        <div style='font-size:24px;font-weight:600'>Virtual Meeting Invitation</div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style='padding-bottom:50px;padding-left:50px;padding-right:50px'>
                        <div style='text-align:left;font-size:16px;color:#444;padding-bottom:18px'>
                            Dear<strong> ${param?.recieverName},</strong></div>
                        <div
                            style='font-size:16px;font-weight:400;color:#000;padding-bottom:25px;line-height:24px'>
                            You have been invited to join "DentalLive Virtual Meeting call" by
                            ${param?.senderName}
                        </div>
                        <div
                            style='font-size:16px;font-weight:400;color:#000;padding-bottom:25px;line-height:24px'>
                            Joining info: ${
                              param?.joiningUrl
                            } - from Chrome or Firefox
                        </div>
                        <table style='width:100%;text-align:left;font-size:14px;margin-bottom:15px'>
                            <tbody>
                                <tr>
                                    <th style='width:190px'>Sender</th>
                                    <td>${param?.senderName}</td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='height:15px'></td>
                                </tr>
                                <tr>
                                    <th style='width:190px'>Date</th>
                                    <td>${param?.date}</td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='height:15px'></td>
                                </tr>
                                <tr>
                                    <th style='width:190px'>Start Time</th>
                                    <td>${param?.startTime}</td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='height:15px'></td>
                                </tr>
                                <tr>
                                    <th style='width:190px'>Duration</th>
                                    <td>${param?.duration}</td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='height:15px'></td>
                                </tr>
                            </tbody>
                        </table>
                        <div
                            style="font-size:15px;font-weight:700;color:#000000;padding-bottom:10px;line-height:24px;">
                            Email Details</div>
                        <div
                            style="color:#000000;border:1px solid #ECE9F1;border-radius:10px;padding:15px;margin-bottom:25px;">
                            ${param?.details}</div>

                           ${
                             param?.attachments
                               ? '<div style="font-size:15px;font-weight:700;color:#000000;padding-bottom:10px;line-height:24px;">Email Attachments</div><div style="color:#000000;border:1px solid #ECE9F1;border-radius:10px;padding:15px;margin-bottom:25px;">' +
                                 param?.attachments +
                                 "</div>"
                               : ""
                           } 
                       
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td width='100%' valign='middle'
                        style='font-size:18px;font-weight:700;color:#393939;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px;background:#f1f1f1;border-top:1px solid #e1e1e1;border-bottom-left-radius:10px;border-bottom-right-radius:10px'>
                        <div
                            style='font-size:16px;font-weight:700;color:#444;padding-bottom:5px;line-height:24px'>
                            Regard,</div>
                        <div style='font-size:14px;font-weight:400;color:#444;line-height:24px'>Dental Live
                            Team
                        </div>
                        <div style='font-size:14px;font-weight:400;color:#444;line-height:24px'>For any
                            queries,
                            write to us at <a
                                href='mailto:contact@dentallive.com;'>contact@dentallive.com</a>or
                            call us at +1 289-474-5200</div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</body>`;
}
