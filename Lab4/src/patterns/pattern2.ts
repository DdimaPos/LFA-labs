export const pattern2 = (): string => {
  var generated_string: string;
  let QRS: string = ["Q", "R", "S"][Math.floor(Math.random() * 3)];
  let UVWX: string = (
    Math.random() < 0.33 ? "UV" : Math.random() < 0.66 ? "W" : "X"
  ).repeat(Math.floor(Math.random() * 6));
  let Z: string = "Z".repeat(Math.floor(Math.random() * 5) + 1);

  generated_string = `P${QRS}T${UVWX}${Z}`;
  return generated_string;
};
