PATH_TFS=../tfs/HouseOfFraser
PATH_TFS_UX=$PATH_TFS/Websites/DeliveryFromUX

###
### Do not change after this point
###
PATH_GIT=`pwd`

# Remove everything from src/ and build/ folders
rm -r --force $PATH_TFS_UX/src
rm -r --force $PATH_TFS_UX/build

# Create src/ and build/ folders
mkdir $PATH_TFS_UX/src
mkdir $PATH_TFS_UX/build

# Copy everything from the git folders src/ and build/ to the same folders in the TFS folder
cp -r -v src/* $PATH_TFS_UX/src
cp -r -v build/* $PATH_TFS_UX/build
cp -r -v build/* $PATH_TFS_UX/

# Go to TFS 
cd $PATH_TFS

# Add all files
git add . --all

# Make commmit
git commit -a -m "UX Delivery"

# Merge with other files
git tf pull --rebase

# Checkin to TFS
git tf checkin --no-lock