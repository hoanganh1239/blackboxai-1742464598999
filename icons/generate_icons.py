from PIL import Image
import cairosvg
import io

# Kích thước biểu tượng cần tạo
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Đọc file SVG và chuyển đổi thành PNG
def svg_to_png(size):
    png_data = cairosvg.svg2png(url='icon.svg', output_width=size, output_height=size)
    img = Image.open(io.BytesIO(png_data))
    img.save(f'icon-{size}x{size}.png')

# Tạo biểu tượng cho mỗi kích thước
for size in sizes:
    svg_to_png(size)
    print(f'Created icon-{size}x{size}.png')