import {supabase } from "./supabaseClient.js";
import {user} from "./infoUser"

const subjectsManager={};
subjectsManager.getSubjects=()=>{
    const semester=user.getSemester()
    const program=user.getProgram()
    console.log("SEMESTER ")
    console.log(semester)
    console.log("PROGRAM")
    console.log(program)

}

export default subjectsManager;
