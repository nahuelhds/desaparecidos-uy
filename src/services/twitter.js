const fs = require("fs");
const Twit = require("twit");
const { env } = require("./config");
const { logger } = require("./logger");

const T = new Twit({
  consumer_key: env.TWITTER_CONSUMER_KEY,
  consumer_secret: env.TWITTER_CONSUMER_SECRET,
  access_token: env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function updateWithMedia(
  status,
  coloredMediaPath,
  mediaPath,
  mediaAltText
) {
  const coloredb64content = fs.readFileSync(coloredMediaPath, {
    encoding: "base64",
  });
  const b64content = fs.readFileSync(mediaPath, { encoding: "base64" });

  // first we must post the media to Twitter
  T.post("media/upload", { media_data: coloredb64content }, function (
    err,
    data
  ) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    const coloredMediaIdStr = data.media_id_string;
    const altText = mediaAltText;
    const meta_params = {
      media_id: coloredMediaIdStr,
      alt_text: { text: altText },
    };

    T.post("media/metadata/create", meta_params, function (err) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        const params = {
          status: status,
          media_ids: [coloredMediaIdStr],
        };

        // first we must post the media to Twitter
        T.post("media/upload", { media_data: b64content }, function (
          err,
          data
        ) {
          // now we can assign alt text to the media, for use by screen readers and
          // other text-based presentations and interpreters
          const mediaIdStr = data.media_id_string;
          const altText = mediaAltText;
          const meta_params = {
            media_id: mediaIdStr,
            alt_text: { text: altText },
          };

          T.post("media/metadata/create", meta_params, function (err) {
            if (!err) {
              // now we can reference the media and post a tweet (media will attach to the tweet)
              const params = {
                status: status,
                media_ids: [coloredMediaIdStr, mediaIdStr],
              };

              T.post("statuses/update", params, function (err, data, response) {
                console.log(data);
              });
            }
          });
        });
      }
    });
  });
}

module.exports = { updateWithMedia };
