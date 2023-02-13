import { Application } from "../declarations";
import dbAgent from "./db-agent";

export default function(app:Application):void{
    app.configure(dbAgent);
}