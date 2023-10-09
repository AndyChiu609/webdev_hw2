# Web Programming HW#2

## Run the app (後面有說明進階條件實作內容)

Follow the instructions in this section to run the app locally.

### 1. setup backend `.env`

Start by creating the `.env` file in the backend folder, then fill the `PORT` and  `MONGO_URL` with 8000 and ur MongoDB URL.


```bash
PORT=8000
MONGO_URL="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```

### 2. setup backend node_modules

Do this do bring back the node modules in backend.

```bash
cd backend
yarn install
```

### 3. setup frontend node_modules

Do this do bring back the node modules in frontend.

```bash
cd frontend
yarn install
```

### 4. Run the backend server 

Do this do start the server and connect to MongoDB.

```bash
cd backend
yarn dev
```

### 5. Run and open the website

```bash
cd frontend
yarn dev
```

you could then click the localhost link below to enter the website.

## 進階條件實作內容說明

### 1. 重複名稱檢測：新增播放清單、歌曲時，需檢查資料庫，確定名稱不可重複。

透過frontend的邏輯設定，使使用者在創造新歌單以及歌曲時，不能輸入重複的歌單名稱以及歌曲名稱，具體做法為，在post之前先get歌單&歌曲資料，檢查是否與輸入的內容相同，若相同則

```bash

  const handleCreate = async () => {
    if (!title) {
      setTitleErr(true);
      return;
    } else {
      setTitleErr(false);
    }
    if (!description) {
      setDescriptionErr(true);
      return;
    } else {
      setDescriptionErr(false);
    }

    try {
      // Use Axios to fetch playlists
      const response = await axios.get("http://localhost:8000/api/playlists");
      const playlists = response.data;

      const titleExists = playlists.some(
        (playlist: Playlist) => playlist.title === title,
      );

      if (titleExists) {
        alert(
          "A playlist with this title already exists. Please choose a different title.",
        );
        return;
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("Error checking playlist titles. Please try again.");
      return;
    }

    const newPlaylist = {
      title: title,
      description: description,
    };

    try {
      // Use Axios to send a POST request
      const response = await axios.post(
        "http://localhost:8000/api/playlists",
        newPlaylist,
      );
      console.log(response.data);
      handleClose();
      onCreate();
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Error creating playlist. Please try again.");
    }
  };

```

### 2, 使用者提示：當使用者未輸入資訊或是進行錯誤操作時，給予適當提示。例如使用者新增或編輯清單時，未輸入標題，以彈窗提示「請輸入標題」。

在歌單的部分，在創造歌單時，若標題與敘述沒有被輸入(not true)，則將觸發錯誤，以下為達成該功能的部分程式碼


```bash

 const handleCreate = async () => {
    if (!title) {
      setTitleErr(true);
      alert("請輸入標題");
      return;
    } else {
      setTitleErr(false);
    }
    if (!description) {
      setDescriptionErr(true);
      alert("請輸入說明");
      return;
    } else {
      setDescriptionErr(false);
    }

```

歌曲的部分同理

```bash
  const handleSaveNewSong = async () => {
    if (newSongData.songName && newSongData.singer && newSongData.link) {
      try {
        // Fetch all songs for the current playlist
        const response = await axios.get(
          `http://localhost:8000/api/playlists/${playlistId}/songs`,
        );
        const existingSongs = response.data;

        // Check if a song with the given name already exists in the playlist
        const songExists = existingSongs.some(
          (song: { songName: string }) =>
            song.songName === newSongData.songName,
        );

        if (songExists) {
          alert(
            "A song with the same name already exists in this playlist. Please choose a different song name.",
          );
        } else {
          // No song with the same name exists in the current playlist, proceed to create the new song
          await axios.post(
            `http://localhost:8000/api/playlists/${playlistId}/songs`,
            newSongData,
          );

          onClose();
          onSongAdded();
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          console.error("Data:", axiosError.response.data);
          console.error("Status:", axiosError.response.status);
          console.error("Headers:", axiosError.response.headers);
        } else if (axiosError.request) {
          console.error("No response received:", axiosError.request);
        } else {
          console.error("Error setting up the request", axiosError.message);
        }

        alert("Error occurred while adding the song. Please try again.");
      }
    } else {
      alert("Entering Song Name, Singer and link is a MUST!");
    }
  };

```


## Lint檢查說明

### 1. 檢查frontend
 
```bash
cd frontend
yarn lint
```

### 3. 檢查backend
 
```bash
cd backend
yarn lint
```
