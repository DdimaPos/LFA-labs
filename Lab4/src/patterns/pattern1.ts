export const pattern1 = ():string =>{
  var generated_string:string;
  var a_b: string = Math.random() < 0.5 ?"a":"b";
  var c_d: string = Math.random() < 0.5?"c":"b";
  var n_of_repeats = Math.ceil(Math.random()*5) + 1;
  var E = "E".repeat(n_of_repeats)
  generated_string=`${a_b}${c_d}${E}G`
  return generated_string;
}

