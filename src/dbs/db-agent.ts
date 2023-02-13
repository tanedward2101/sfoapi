import knex from "knex";
import { Application } from "../declarations";

export default function(app: Application):void{
    const {client,connection} =app.get('agent');
    const db= knex({client,connection})
    
    app.set('db-agent',db);

}