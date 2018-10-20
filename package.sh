#!/bin/sh
set -u
set -e

VERSION=`cat manifest.json | grep '"version"' | sed -E 's/.*"([.0-9]+)".*/\1/'`
FILENAME=onecheckbox-${VERSION}.zip

die() {
  >&2 echo $*
  exit 1
}

check_for_file() {
  [ ! -e ${FILENAME} ] || die "ERROR: ${FILENAME} already exists."
}

package() {
  zip -qr9 "${FILENAME}" * -x "package.sh" -x *.zip -x images/*.sketch
}

report() {
  echo "Packaged ${FILENAME}"
  if [ "${OSTYPE//[0-9.]/}" == "darwin" ]; then
    osascript >/dev/null \
    -e 'tell application "Finder"' \
    -e activate \
    -e "reveal POSIX file \"${PWD}/${FILENAME}\"" \
    -e end tell
  fi
}

check_for_file && \
package        && \
report || die "Something went wrong."

exit 0
