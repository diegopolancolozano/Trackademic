import {supabase } from "./supabaseClient.js";
import {user} from "./infoUser"

const subjectsManager={};

subjectsManager.getSubjects=async ()=>{
    const semester=user.getSemester()
    const program=user.getProgram()
    

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
subjectsManager.addSubject=async(subject,name)=>{
    const semester=user.getSemester();
    const program=user.getProgram();
    const {error} = await supabase  
    .from('subjects')  
    .insert({'semester':semester,'program_code':program,'code':subject,'name':name})
    
    return error==null
}


export default subjectsManager;
