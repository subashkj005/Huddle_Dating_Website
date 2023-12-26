import logging
from colorama import Fore, Style


# Configure the root logger to DEBUG level
# logging.basicConfig(level=logging.DEBUG)


class ColoredLogger:
    def __init__(self, name, level=logging.DEBUG):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        formatter = logging.Formatter("{asctime} - {levelname} - {message}",
                                      datefmt="%Y-%m-%d %H:%M:%S", style="{")
        self.handler = logging.StreamHandler()
        self.handler.setFormatter(formatter)
        self.logger.addHandler(self.handler)

    def error(self, message, *args, **kwargs):
        self._log(logging.ERROR, Fore.RED, message, *args, **kwargs)

    def info(self, message, *args, **kwargs):
        self._log(logging.INFO, Fore.GREEN, message, *args, **kwargs)

    # Add methods for other logging levels as needed

    def _log(self, level, color, message, *args, **kwargs):
        message = "\n" + color + Style.BRIGHT + message + Style.RESET_ALL + "\n"
        self.logger.log(level, message, *args, **kwargs)


logger = ColoredLogger(__name__)
