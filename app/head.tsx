import { NextSeo } from "next-seo";

export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="google-site-verification"
        content="vYyu7gttcFkYJg6JtKSjbvTsfJ9wbE3Sj25sw5-ofiQ"
      />
      <link rel="manifest" href="/manifest.json" />
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
              url: "https://sitbofqhkzbwjpbcmnwp.supabase.co/storage/v1/object/public/images/logo.png",
              width: 800,
              height: 600,
              alt: "logo",
              type: "image/png",
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
