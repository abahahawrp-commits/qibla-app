import zlib
import struct
import math
import os

def create_png(width, height, filename):
    # Colors
    # Deep emerald background: #071914 (7, 25, 20)
    # Emerald gradient: (13, 42, 35)
    # Gold crescent: #f59e0b (245, 158, 11)
    # Bright Gold: (254, 240, 138)

    cx = width / 2.0
    cy = height / 2.0
    radius = min(width, height) * 0.42

    raw_data = bytearray()

    for y in range(height):
        raw_data.append(0) # Filter byte: None
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx * dx + dy * dy)

            # Base emerald background
            r = 7
            g = 25
            b = 20
            a = 255

            # Subtle radial vignette
            if dist < radius * 1.15:
                vignette = 1.0 - (dist / (radius * 1.15)) * 0.4
                r = int(13 * vignette)
                g = int(45 * vignette)
                b = int(36 * vignette)

            # Circular border ring
            if abs(dist - radius * 0.95) < (width * 0.015):
                r = 52
                g = 211
                b = 153

            # Crescent Moon calculation
            # Main circle center: (cx - width*0.05, cy) with r1
            r1 = radius * 0.55
            d1 = math.sqrt((x - (cx - width * 0.04))**2 + (y - cy)**2)

            # Cutout circle center: (cx + width*0.08, cy - height*0.08) with r2
            r2 = radius * 0.52
            d2 = math.sqrt((x - (cx + width * 0.08))**2 + (y - (cy - height * 0.06))**2)

            if d1 <= r1 and d2 >= r2:
                # Inside crescent
                r = 245
                g = 158
                b = 11

            # Star at (cx + width*0.14, cy - height*0.14)
            star_dx = x - (cx + width * 0.14)
            star_dy = y - (cy - height * 0.14)
            star_dist = math.sqrt(star_dx**2 + star_dy**2)
            if star_dist <= (width * 0.06):
                r = 254
                g = 240
                b = 138

            raw_data.extend([r, g, b, a])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png_header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = chunk(b'IHDR', ihdr_data)
    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    iend = chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png_header + ihdr + idat + iend)

os.makedirs('public', exist_ok=True)
create_png(192, 192, 'public/pwa-192x192.png')
create_png(512, 512, 'public/pwa-512x512.png')
create_png(512, 512, 'public/pwa-maskable-512x512.png')
create_png(180, 180, 'public/apple-touch-icon.png')
create_png(48, 48, 'public/favicon.ico')
print("All PWA PNG icons generated successfully!")
