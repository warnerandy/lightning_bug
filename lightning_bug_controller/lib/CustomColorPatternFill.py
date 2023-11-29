from adafruit_led_animation.animation import Animation
import math


class CustomColorPatternFill(Animation):
    """
    Chase pixels in one direction, like a theater marquee with Custom Colors

    :param pixel_object: The initialised LED object.
    :param float speed: Animation speed rate in seconds, e.g. ``0.1``.
    :param colors: Animation colors in list of `(r, g, b)`` tuple, or ``0x000000`` hex format
    :param size: Number of pixels to turn on in a row.
    :param spacing: Number of pixels to turn off in a row.
    :param reverse: Reverse direction of movement.
    """

    # pylint: disable=too-many-arguments
    def __init__(
        self,
        pixel_object,
        speed,
        size=2,
        name=None,
        reverse=False,
        colors=[],
    ):
        self._num_colors = len(colors)
        self._colors = colors
        self._color_idx = 0
        self._pattern_len = self._num_colors * size
        self.offset = 0
        self._size = size
        self.hop = -1
        if reverse:
            self.hop = 1
        self._reverse = reverse
        self.nPixels = len(pixel_object)
        super().__init__(pixel_object, speed, size, name)

    def getNextColor(self,idx):
        colors = self._colors
        currentColorIdx = 0
        colorIdx = math.floor(idx/self._size)

        if colorIdx >= self._num_colors:
            colorIdx =- self._num_colors

        return colors[colorIdx]

    def draw(self):
        colors = self._colors
        idx = 0
        patternIdx = self.offset
        while idx < self.nPixels:
            self.pixel_object[idx] = self.getNextColor(patternIdx)
            patternIdx += self.hop
            if patternIdx < 0:
                patternIdx = self._pattern_len - 1
            if patternIdx >= self._pattern_len:
                patternIdx = 0
            idx += 1

        self.offset += 1
        if self.offset >= self._pattern_len:
            self.offset = 0

