export const UploadSvgIcon = (): string => {
  return `
    <svg width="30" height="30" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
      <g>
        <g>
          <path d="M50,40c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15
            C65,46.718,58.283,40,50,40z M90,25H78c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,11.28,68.65,10,67,10H33
            c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309C25.426,23.72,23.65,25,22,25H10C4.5,25,0,29.5,0,35v45c0,5.5,4.5,10,10,10h80
            c5.5,0,10-4.5,10-10V35C100,29.5,95.5,25,90,25z M50,80c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25
            c13.805,0,25,11.194,25,25C75,68.807,63.805,80,50,80z M86.5,41.993c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5
            c1.934,0,3.5,1.568,3.5,3.5C90,40.427,88.433,41.993,86.5,41.993z" />
        </g>
      </g>
    </svg>
  `
}

export const ThreeDotsIndicator = (): string => {
  return `
    <svg width="40" height="10" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
      <circle cx="15" cy="15" r="15">
        <animate attributeName="r" from="15" to="15"
          begin="0s" dur="0.8s"
          values="15;9;15" calcMode="linear"
          repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="1" to="1"
          begin="0s" dur="0.8s"
          values="1;.5;1" calcMode="linear"
          repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate attributeName="r" from="9" to="9"
          begin="0s" dur="0.8s"
          values="9;15;9" calcMode="linear"
          repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="0.5" to="0.5"
          begin="0s" dur="0.8s"
          values=".5;1;.5" calcMode="linear"
          repeatCount="indefinite" />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate attributeName="r" from="15" to="15"
          begin="0s" dur="0.8s"
          values="15;9;15" calcMode="linear"
          repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="1" to="1"
          begin="0s" dur="0.8s"
          values="1;.5;1" calcMode="linear"
          repeatCount="indefinite" />
      </circle>
    </svg>
  `
}