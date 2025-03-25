<template>
  <section
    class="section relative flex-center flex-col align-center max-h-screen h-screen overflow-hidden"
  >
    <div
      class="absolute flex-center flex-col align-center max-h-screen h-screen overflow-hidden top-0 left-0 right-0 bottom-0 z-10"
    >
      <img src="/images/svg/404.svg" alt="404 image" />
      <h2
        class="mb-3 mt-[60px] text-center text-white text-[32px] leading-130 font-bold"
      >
        {{ $t("error_404") }}
      </h2>
      <p class="mb-8 text-center text-gray text-xl leading-130">
        {{ $t("error_404_description") }}
      </p>
      <div class="flex-center cursor-pointer">
        <router-link
          to="/"
          class="px-[18px] py-3 gap-2 text-white bg-blueDark rounded-[10px] hover:bg-blueDark transition-300 cursor-pointer flex items-center z-10"
        >
          <span class="icon-home text-white" />
          {{ $t("back_to_home") }}
        </router-link>
      </div>
    </div>

    <!--    pattern-->
    <div
      class="pattern absolute top-0 left-0 right-0 bottom-0 z-0 flex-center flex-col align-center max-h-screen h-screen overflow-hidden"
    >
      <svg
        width="1040"
        height="660"
        viewBox="0 0 1040 660"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M786.499 1.5H787.139C792.89 40.3073 811.403 76.2692 839.919 104.001C868.441 131.737 905.417 149.731 945.305 155.317V155.844C905.417 161.429 868.44 179.423 839.918 207.16C811.402 234.891 792.889 270.854 787.139 309.662H786.499C780.75 270.854 762.237 234.892 733.721 207.162C705.199 179.426 668.222 161.434 628.334 155.852V155.308C668.222 149.726 705.199 131.734 733.721 103.999C762.237 76.2689 780.75 40.307 786.499 1.5ZM589.014 372.256C608.359 353.072 621.047 328.306 625.281 301.543C629.516 328.306 642.204 353.072 661.548 372.257C680.871 391.42 705.806 403.993 732.752 408.207C705.806 412.42 680.871 424.993 661.548 444.156C642.203 463.341 629.515 488.107 625.281 514.871C621.047 488.107 608.359 463.342 589.014 444.158C569.682 424.986 544.732 412.411 517.772 408.206C544.732 404.002 569.682 391.427 589.014 372.256ZM914.186 362.146C918.792 393.156 933.346 421.884 955.71 444.064C978.052 466.22 1006.98 480.645 1038.2 485.227C1006.98 489.809 978.051 504.233 955.71 526.39C933.345 548.57 918.791 577.298 914.186 608.308C909.582 577.299 895.028 548.571 872.663 526.392C850.31 504.224 821.363 489.798 790.121 485.227C821.363 480.655 850.31 466.23 872.663 444.062C895.028 421.884 909.582 393.155 914.186 362.146ZM271.499 51.5H272.139C277.89 90.3073 296.403 126.269 324.919 154.001C353.441 181.737 390.417 199.731 430.305 205.317V205.844C390.417 211.429 353.44 229.423 324.918 257.16C296.402 284.891 277.889 320.854 272.139 359.662H271.499C265.75 320.854 247.237 284.892 218.721 257.162C190.199 229.426 153.222 211.434 113.334 205.852V205.308C153.222 199.726 190.199 181.734 218.721 153.999C247.237 126.269 265.75 90.307 271.499 51.5ZM110.281 351.543C114.516 378.306 127.204 403.072 146.548 422.257C165.871 441.42 190.806 453.993 217.752 458.207C190.806 462.42 165.871 474.993 146.548 494.156C127.203 513.341 114.515 538.107 110.281 564.871C106.047 538.108 93.3591 513.342 74.0145 494.158C54.6821 474.986 29.7318 462.411 2.7717 458.206C29.7317 454.002 54.6821 441.427 74.0145 422.256C93.3592 403.072 106.047 378.306 110.281 351.543ZM357.663 494.062C380.028 471.884 394.582 443.155 399.186 412.146C403.792 443.156 418.346 471.884 440.71 494.064C463.052 516.221 491.98 530.645 523.203 535.227C491.98 539.809 463.051 554.233 440.71 576.39C418.345 598.57 403.791 627.298 399.186 658.308C394.582 627.299 380.028 598.571 357.663 576.392C335.31 554.224 306.363 539.798 275.121 535.227C306.363 530.655 335.31 516.23 357.663 494.062Z"
          stroke="url(#paint0_linear_9602_36157)"
          stroke-opacity="0.6"
          stroke-width="3"
        />
        <defs>
          <linearGradient
            id="paint0_linear_9602_36157"
            x1="262.5"
            y1="50"
            x2="262.5"
            y2="660"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="1" stop-color="white" stop-opacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.section {
  background: #080a15;
  backdrop-filter: blur(42px);
}

.section::after {
  content: "";
  width: 100%;
  height: 160px;
  position: absolute;
  flex-shrink: 0;
  bottom: -224px;
  border-radius: 1440px;
  background: linear-gradient(
    180deg,
    #077e94 21.35%,
    rgba(7, 126, 48, 0.7) 100%
  );
  filter: blur(450px);
}
</style>
