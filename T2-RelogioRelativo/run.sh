# P1
gnome-terminal -- node client.js --port=27015 --neighboors=127.0.0.1:27015,127.0.0.1:27016,127.0.0.1:27017 &&
# P2
gnome-terminal -- node client.js --port=27016 --neighboors=127.0.0.1:27015,127.0.0.1:27016,127.0.0.1:27017 &&
# P3
gnome-terminal -- node client.js --port=27017 --neighboors=127.0.0.1:27015,127.0.0.1:27016,127.0.0.1:27017
