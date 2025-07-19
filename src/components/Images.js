export function lobbyPicture(imageEnc) {
    const img = new Image();
    img.alt = "Lobby Picture";
    img.id = 'lobby-pic'
    img.src = `data:image/jpeg;base64,${imageEnc}`;
    return img;
}