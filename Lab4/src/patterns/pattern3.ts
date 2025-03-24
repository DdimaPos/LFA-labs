export const pattern3 = (): string => {
  var generated_string: string;
  var bin:string = (Math.random() < 0.5 ? "0" : "1").repeat(Math.ceil(Math.random() * 5) + 1);
  var rep34:string = (Math.random() < 0.5 ? "3" : "4").repeat(5);

  generated_string = `1${bin}2${rep34}36`;
  return generated_string;
};
