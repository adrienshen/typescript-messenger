export function getHost() {
  return window.location.hostname;
}

export const sleep = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export const retry = (operation: (...arg: any[]) => any) =>
({ retries, interval }: {retries: number, interval: number}): any => async (
  cleanup = () => {}
) => {
  try {
    return await operation();
  } catch (err) {
    if ("Bugsnag" in window) {
      (window as any)["Bugsnag"].notify(err);
    }
    this.$emit("error", { err });
    if (retries === 0) {
      cleanup();
      return;
    }
    await sleep(interval);
    return await retry(operation)({
      retries: --retries,
      interval
    })(cleanup);
  }
};

export const getProp = (obj: any) => (...args: any[]): any => {
  if (obj === null || typeof obj !== "object") {
    return;
  }
  const [firstProp, ...props] = args;
  if (!(firstProp in obj)) {
    return;
  }
  if (props.length === 0) {
    return obj[firstProp];
  }
  return getProp(obj[firstProp])(...props);
};

export function makeEllipsis(text: string, maxLength: number, ellipsis: string = "...") {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + ellipsis;
  }
  return text;
}

export function isEmoji(str: string) {
  // https://medium.com/@thekevinscott/emojis-in-javascript-f693d0eb79fb#.wi68bnnu6
  return /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]){1,3}$/.test(
    str
  );
}

export function readFile(f: File) {
  return new Promise((resolve, /*reject*/) => {
    let fr = new FileReader();
    fr.onload = e => {
      resolve((e as any).target.result);
    };
    fr.readAsDataURL(f);
  });
}

export function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}

export const chatConfig = {
  tenant: "ringgitplus",
  top: {
    hidden: true,
    name: "Guest",
    tenant: "RinggitPlus"
  },
  transcript: {
    bubble: {
      background: "rgb(241, 240, 240)",
      color: "#333"
    },
    fromMeBubble: {
      background: "rgb(11, 66, 138)",
      color: "white"
    },
    url: {
      color: "rgb(11, 66, 138)"
    },
    postback: {
      color: "rgb(11, 66, 138)"
    },
    pollSpeed: 50
  },
  bottom: {
    showMenu: true,
    history: true,
    showCamera: true,
    input: {
      lockable: false
    },
    tnc: {
      links: {
        campaign: "https://apply.uob.ringgitplus.com/tnc.html",
        ringgitplus: "https://www.ringgitplus.com/tnc.html",
        privacy: "https://www.ringgitplus.com/privacy.html",
      },
      hideAttempts: 1,
      show: true,
      style: {}
    },
    photoCamera: {
      fill: "#888"
    },
    sendButton: {
      color: "#06a7ff",
    },
    list: {
      borderColor: "rgb(11, 66, 138)",
      background: "white",
      color: "rgb(11, 66, 138)",
      width: "auto",
      padding: "0 12px",
      borderRadius: "15px",
      lineHeight: "29px"
    },
    rule: {},
    comment: {
      color: "rgba(11, 66, 138, 0.75)"
    }
  }
};
