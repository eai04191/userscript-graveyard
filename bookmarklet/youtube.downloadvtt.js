(() => {
    const captionsBaseUrl =
        ytInitialPlayerResponse.captions.playerCaptionsRenderer.baseUrl;

    const vttUrl = new URL(captionsBaseUrl);

    vttUrl.searchParams.append("fmt", "vtt");
    vttUrl.searchParams.append("kind", "asr");
    vttUrl.searchParams.append("lang", "en");
    vttUrl.searchParams.append("tlang", "ja");

    open(vttUrl.href);
    return;
})();
