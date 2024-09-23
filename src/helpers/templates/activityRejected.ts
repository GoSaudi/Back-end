import { getFooter } from "../templates";

export default ({ vendorName, approvalReason, activityId, isApproved }) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activity ${isApproved ? "Approved" : "Rejected"}</title>
    </head>
    <body>
        <table border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse: collapse; table-layout: fixed; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: top; min-width: 320px; margin: 0 auto; background-color: #f9f9f9; width: 100%;">
            <tr>
                <td>
                    <div style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                        <table border="0" cellpadding="0" cellspacing="0" valign="top" style="width: 100%; background-color: transparent;">
                            <tr>
                                <td style="text-align: center; padding: 10px;">
                                    <a href="#" style="text-decoration: none;">
                                    <img src="https://gosaudiapi.projectdemo.site/uploads/logo_light_2_629852f19b.png" style="max-width: 100%; height: auto; width: 110px;" />
                                    </a>
                                </td>
                            </tr>
                        </table>
                      </div>
                      

                    <div style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; background-color: rgb(32, 120, 61); text-align: center;">
                            <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
                    
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                                    <img align="center" border="0" src="https://gosaudiapi.projectdemo.site/uploads/incorrect_1_050080bb33.png" alt="Image" title="Image" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; width: 10%; max-width: 50px;" width="50">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                    
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; font-family: 'Cabin', sans-serif; color: #fff;">
                                    <p style="font-size: 20px;"><strong>Your activity has been ${
                                      isApproved ? "approved" : "rejected"
                                    }!</strong></p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    
    
    
                    <div style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #fff;">
                            <tr>
                                <td style="padding: 30px 20px; font-family: 'Cabin', sans-serif; color: #000;">
                                    <div style="color: #000000; line-height: 160%; text-align: center; word-wrap: break-word;">
                                        <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 22px; line-height: 35.2px;">Hi ${
                                          vendorName || ""
                                        }, </span></p>
                                        <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;">Your activity submission has been ${
                                          isApproved ? "approved" : "rejected"
                                        }${
    approvalReason ? " for the below mentioned reasons" : "."
  }</span></p>
                                        <p style="font-size: 14px; line-height: 160%; background-color: #bbd7b480;"><span style="font-size: 18px; line-height: 28.8px;">${
                                          approvalReason || ""
                                        }</span></p>
                                        <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;">Review your <a href="https://gosaudi.projectdemo.site/activity/${activityId}" style="text-decoration: none; color: rgb(32, 120, 61);">activity here</a></span></p>
                                    </div>
                                </td>
                            </tr>
                            
                            
                        
                        </table>
                    </div>
    
                   
    
                      
    
                    ${getFooter()}
                    
                </td>
            </tr>
        </table>
    </body>
    </html>
      `;
};
