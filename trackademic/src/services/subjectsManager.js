import {supabase } from "./supabaseClient.js";
import {user} from "./infoUser"

const subjectsManager={};

subjectsManager.getSubjects=async ()=>{
    const semester=user.getSemester()
    const program=user.getProgram()
    console.log("SEMESTER ")
    console.log(semester)
    console.log("PROGRAM")
    console.log(program)

    const { data, error } = await supabase 
    .from('subjects')
    .select()
    .eq('program_code',program)
    .eq('semester',semester)
    
    // .from('subjects')  
    // .select('code','name')  
    // .eq('semester', semester)
    // .eq('program',program)
    return data



}

export default subjectsManager;
