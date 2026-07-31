{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.uv
    pkgs.gcc
    pkgs.stdenv.cc.cc.lib
  ];

  UV_TOOL_DIR = "${toString ./.}/.uv-tools";
  UV_TOOL_BIN_DIR = "${toString ./.}/.uv-tools/bin";

  shellHook = ''
    export PATH="$UV_TOOL_BIN_DIR:$PATH"
    export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
    if [ ! -x "$UV_TOOL_BIN_DIR/graphify" ]; then
      uv tool install graphifyy
    fi
  '';
}
