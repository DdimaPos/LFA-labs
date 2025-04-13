export type GrammarSymbol = string;
export type Production = [GrammarSymbol, GrammarSymbol[]];
export type Grammar = {
  VN: GrammarSymbol[];
  VT: GrammarSymbol[];
  P: Production[];
  S: GrammarSymbol;
};
