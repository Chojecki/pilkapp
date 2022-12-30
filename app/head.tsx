import { NextSeo } from "next-seo";

export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <NextSeo
        useAppDir={true}
        title="PiłkApp"
        description="Appka do umawiania się na mecze"
        openGraph={{
          url: "https://www.pilkapp.pl",
          title: "PiłkaApp",
          description: "Appka do umawiania się na mecze",
          images: [
            {
              url: "https://pilkapp.vercel.app/_next/image?url=/_next/static/media/logo.8cafd7f8.png&w=2048&q=75",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
          ],
          siteName: "PiłkApp",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
    </>
  );
}
