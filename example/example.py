import time
import requests
from PIL import Image

# Konstanten für den Offset
OFFSET_X = 10  # Setze den gewünschten horizontalen Offset
OFFSET_Y = 20  # Setze den gewünschten vertikalen Offset

def send_pixel_data(url, image_path):
    try:
        # Bild einlesen
        img = Image.open(image_path)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
    except IOError:
        print("Fehler beim Einlesen des Bildes.")
        return

    width, height = img.size

    # Pixel durchgehen
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            # Prüfe, ob der Pixel Transparenz enthält
            if a < 255:
                continue  # Überspringe diesen Pixel

            hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b).upper()

            # Berücksichtige den Offset für x und y
            adjusted_x = x + OFFSET_X
            adjusted_y = y + OFFSET_Y

            data = {
                "x": adjusted_x,
                "y": adjusted_y,
                "color": hex_color
            }

            # POST-Anfrage senden
            response = requests.post(url, json=data)
            print(f"Status: {response.status_code}, x: {adjusted_x}, y: {adjusted_y}, color: {hex_color}")

            # Warte 2 Sekunden, um die Bedingung zu erfüllen,
            # dass nur alle 2 Sekunden eine Anfrage gesendet wird
            time.sleep(2.1)

if __name__ == "__main__":
    image_path = "tux.png" # Setze den Pfad zu deinem Bild hier
    url = "http://localhost:3000/api/pixel" # Ändere den Port, falls nötig
    send_pixel_data(url, image_path)
