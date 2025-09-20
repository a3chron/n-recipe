import Constants from "expo-constants";

export const getAppVersion = (): string => {
  // Get version from expo config
  return Constants.expoConfig?.version || "1.0.0";
};

export const getVersionFromExtra = (): string => {
  // Alternative: get from extra field
  return Constants.expoConfig?.extra?.version || "1.0.0";
};

export const getVersionCode = (): number => {
  // Get the version code (Android)
  return Constants.expoConfig?.android?.versionCode || 1;
};

export const getFullVersionInfo = () => {
  return {
    version: getAppVersion(),
    buildNumber: getVersionCode(),
    formatted: `v${getAppVersion()} (${getVersionCode()})`,
  };
};
