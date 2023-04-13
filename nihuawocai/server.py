
import http.server
import socketserver

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 80), Handler) as httpd:
    print("serving at port", 80)
    httpd.serve_forever()