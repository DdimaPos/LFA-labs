//Variant 1:
//(a|b)(c|d)E+G?
//P(Q|R|S)T(UV|W|X)*Z+
//1(0|1)*2(3|4)^5 36

import {pattern1} from "./patterns/pattern1" 
import {pattern2} from "./patterns/pattern2" 
import {pattern3} from "./patterns/pattern3" 

interface generationExample{
  pattern1: string,
  pattern2: string,
  pattern3: string,
}

function Main():void{
  var table: generationExample[] = new Array(40)
  var tableItem:generationExample;
  for(var i=0;i<40;i++){
    tableItem={
      pattern1: pattern1(),
      pattern2: pattern2(),
      pattern3: pattern3()
    } 
    table[i] = tableItem;
  }
  console.table(table)
}
Main();
