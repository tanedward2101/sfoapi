import { Application } from "@feathersjs/express";
import { ServiceMethods } from "@feathersjs/feathers";
import { Knex } from "knex";
import { createTransport, Transporter, SendMailOptions } from "nodemailer";

export class Mails implements Partial<ServiceMethods<SendMailOptions>> {
  app: Application
  private transporter: Transporter;

  constructor(app: Application) {
    this.app = app;
    // We initialize the transporter.
    this.transporter = createTransport({
      service: "GMail",
      auth: {
        user: "tan.edward.94@gmail.com",
        pass: "ogholzgxkakjnhpp"
      }
    });
  }

  /**
   * We send the email.
   * @param data 
   * @returns 
   */
  async create(data: Partial<SendMailOptions>): Promise<any> {
    const dbagent: Knex = this.app.get('db-agent');
    var message={}
    return await dbagent('users').select('email').from('users').where('email', data.to).then(async unl => {
      if (unl.length == 0) {
        var otp = Math.floor(100000 + Math.random() * 900000);

        await dbagent('users').insert([{
          email: data.to,
          password: '',
          full_name: '',
          otp: otp
        }])

        var email = {
          "from": "VERIFICATION <tan.edward.94@gmail.com>",
          "to": data.to,
          "subject": "Verification Email",
          "html": "<div>Please enter this OTP on your phone:</div><b>" + otp + "</b>"
        }
        this.transporter.sendMail(email);
        message={msg:"EMAIL VERIFICATION SENT"}
      }
      else {
        message={msg:"EMAIL EXIST"}
      }
      return message

    })
  }

}
