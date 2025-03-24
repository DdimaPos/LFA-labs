Volume = 13 dB
sync{
  Piano(R, do)
  Guitar(G)
}

for(note = re; note < si; note += 1){
  Piano(R, note, 1/4)
}
