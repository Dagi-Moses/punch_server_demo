const cron = require("node-cron");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const ENV = require("../config/config");

const mongoUri = process.env.MONGO_URI;
const backupDir = process.env.BACKUP_DIR;

const backupName = `demo_${new Date()
  .toISOString()
  .replace(/:/g, "-")}`;
const rcloneRemote = `"punch demo"`;
const gDriveFolder = process.env.GDRIVE_FOLDER;

const lastBackupFile = path.join(backupDir, "last_backup_time.txt");

const getLastBackupTime = () => {
  if (fs.existsSync(lastBackupFile)) {
    return fs.readFileSync(lastBackupFile, "utf8");
  }
  return null;
};

const updateLastBackupTime = () => {
  fs.writeFileSync(lastBackupFile, new Date().toISOString(), "utf8");
};

const shouldBackupRun = () => {
  const lastBackup = getLastBackupTime();
  const now = new Date();

  if (!lastBackup) {
    return true;
  }

  const lastBackupDate = new Date(lastBackup);
  const diffInMs = now - lastBackupDate;

  return diffInMs > 24 * 60 * 60 * 1000;
};

const cleanupOldBackups = (dir, days) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Failed to read backup directory:", err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Failed to get stats for ${filePath}:`, err);
          return;
        }
        if (stats.mtimeMs < cutoff) {
          // File is older than the cutoff
          fs.rm(filePath, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error(`Failed to delete ${filePath}:`, err);
            } else {
              console.log(`Deleted old backup: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

const cleanupOldGDriveBackups = (remote, folder, days) => {
  exec(
    `rclone delete --min-age ${days}d ${remote}:${folder}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("Failed to clean up old backups in Google Drive:", err);
        return;
      }
      console.log("Old backups in Google Drive cleaned up:", stdout);
    }
  );
};

const runBackup = async () => {
  if (shouldBackupRun()) {
    exec(
      `mongodump --uri=${mongoUri} --out=${path.join(backupDir, backupName)}`,
      (err, stdout, stderr) => {
        if (err) {
          console.error("mongodump failed:", err);
          return;
        }
        console.log("Backup completed:", stdout);

        exec(
          `rclone copy ${path.join(
            backupDir,
            backupName
          )} ${rcloneRemote}:${gDriveFolder}`,
          (err, stdout, stderr) => {
            if (err) {
              console.error("Failed to upload to Google Drive:", err);
              return;
            }
            console.log("Backup uploaded:", stdout);

            cleanupOldBackups(backupDir, 30);

            cleanupOldGDriveBackups(rcloneRemote, gDriveFolder, 30);

            updateLastBackupTime();
          }
        );
      }
    );
  } else {
    console.log("Backup has already been performed today.");
  }
};
cron.schedule("0 18 * * *", () => {
  console.log("Running scheduled backup...");
  if (process.env.NODE_ENV === ENV.PRODUCTION) {
    runBackup();
  } else {
    console.log("Skipping backup on local development machine");
  }
});

if (process.env.NODE_ENV === ENV.PRODUCTION) {
  runBackup();
} else {
  console.log("Skipping backup on local development machine");
}

module.exports = { runBackup };
