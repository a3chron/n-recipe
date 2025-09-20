// Rename app.json to app.config.js and use this content
const { execSync } = require("child_process");

// Get git tag version, fallback to package.json version
function getVersion() {
  try {
    // Try to get the current git tag
    const gitTag = execSync("git describe --tags --exact-match 2>/dev/null", {
      encoding: "utf8",
    }).trim();

    // Remove 'v' prefix if it exists (v1.0.0 -> 1.0.0)
    return gitTag.startsWith("v") ? gitTag.substring(1) : gitTag;
  } catch (error) {
    // Fallback: try to get the latest tag
    try {
      const latestTag = execSync("git describe --tags --abbrev=0 2>/dev/null", {
        encoding: "utf8",
      }).trim();

      const version = latestTag.startsWith("v")
        ? latestTag.substring(1)
        : latestTag;
      console.warn(
        `Warning: Not on a tagged commit. Using latest tag: ${version}`,
      );
      return version;
    } catch (fallbackError) {
      // Final fallback: use package.json version
      console.warn("Warning: No git tags found. Using package.json version.");
      return require("./package.json").version;
    }
  }
}

// Generate version code from version string
function getVersionCode(version) {
  // Convert version like "1.2.3" to version code like 10203
  // This handles up to 99 for each part (major.minor.patch)
  const parts = version.split(".").map((part) => parseInt(part) || 0);
  const major = Math.min(parts[0] || 0, 99);
  const minor = Math.min(parts[1] || 0, 99);
  const patch = Math.min(parts[2] || 0, 99);

  return major * 10000 + minor * 100 + patch;
}

const version = getVersion();
const versionCode = getVersionCode(version);

console.log(`Building version: ${version} (code: ${versionCode})`);

export default {
  expo: {
    name: "n-recipe",
    slug: "n-recipe",
    version: version,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nrecipe",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.a3chron.nrecipe",
      versionCode: versionCode,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-web-browser",
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      version: version, // This makes the version available to the app
    },
    owner: "a3chron",
  },
};
