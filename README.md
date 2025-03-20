# SolCheck Widget 🚀

![Promo Banner](/assets/promo.png)

SolCheck Widget is a small cross-platform widget that displays the **balance** and **profit** of the specified Solana wallet from the moment the widget is launched. 💰

## Features ✨
- **Cross-Platform:** Works on Windows, macOS, and Linux.
- **Automatic Updates:** The balance is updated every 10 seconds.
- **Easy Setup:** On the first launch, a configuration file is created with a default address.
- **Flexibility:** Change the wallet address in the configuration file to track a different wallet (a restart of the application is required).

## Configuration ⚙️

On the first launch, the application checks for the existence of a configuration file. If the file does not exist or does not contain the `address` key, it is created and the default address is written to it.

### Windows
- Press **Win + R** and enter:
```
%APPDATA%\com.solcheck.app\config.json
```
- Find the `address` key and, if needed, change it to your desired address.

### macOS
The configuration file is usually located at:
```
~/Library/Application Support/com.solcheck.app/config.json
```

### Linux
The configuration file can be found at:
```
~/.config/com.solcheck.app/config.json
```

After modifying the wallet address in the configuration file, **restart** the application to apply the changes. 🔄

## Download Latest Release ⬇️
[**Download Latest Release (.exe)**](https://github.com/neckker/solcheck/releases/latest)

