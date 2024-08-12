import { FC } from "react";

interface IconBookmarkProps {
  className?: string;
  bookmark?: boolean;
}

const IconAadhaar: FC<IconBookmarkProps> = ({ className, bookmark = true }) => {
  return (
    <svg
      height={20}
      viewBox="0 0 2500 1819.80163065"
      width={35}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipRule="evenodd" fillRule="evenodd">
        <path
          d="m0 1250.55c22.28-11.12 39.1-30.29 55.76-50.78 20.33-24.94 40.25-48.64 64.92-68.91 29.57-24.26 69.11-47.48 118.85-54.83a1031.412 1031.412 0 0 0 -15 174.52zm167.44-625.27.03.02-.02-.03c24.87 1.51 49.03-6.68 73.69-16.08 30.07-11.44 59.18-21.99 90.67-27.21 37.92-6.25 84.05-6.54 131.02 12.25-74.47 89.15-134.11 191.09-175.11 302.1-39.43-31.25-62.08-71.17-75.57-106.99-11.23-29.9-16.64-60.38-21.77-92.15-4.2-26.09-9.18-51.12-22.94-71.91zm457.54-457.73.01.02v-.03c20.77 13.76 45.8 18.75 71.87 22.94 31.76 5.14 62.24 10.55 92.11 21.79 35.98 13.54 76.06 36.36 107.36 76.14-111.07 40.83-213.09 100.4-302.34 174.78-18.83-47.03-18.56-93.24-12.29-131.21 5.22-31.5 15.76-60.62 27.2-90.7 9.42-24.68 17.6-48.86 16.08-73.73zm625-167.55v.03l.03-.03c11.1 22.31 30.28 39.14 50.76 55.8 24.93 20.35 48.62 40.28 68.88 64.95 24.4 29.77 47.76 69.64 54.95 119.84a1032.405 1032.405 0 0 0 -349.23.01c7.2-50.21 30.54-90.08 54.96-119.85 20.26-24.67 43.95-44.6 68.88-64.95 20.49-16.66 39.66-33.49 50.77-55.8zm625 167.54v.03l.02-.02c-1.52 24.87 6.67 49.04 16.08 73.72 11.42 30.08 21.98 59.2 27.2 90.7 6.25 37.96 6.52 84.17-12.3 131.2-89.23-74.38-191.27-133.93-302.32-174.78 31.3-39.77 71.38-62.58 107.35-76.13 29.88-11.25 60.36-16.66 92.12-21.8 26.07-4.18 51.1-9.17 71.85-22.92zm457.55 457.72-.02.02h.03c-13.74 20.78-18.72 45.81-22.92 71.9-5.14 31.76-10.55 62.25-21.77 92.14-13.49 35.83-36.14 75.74-75.58 106.99-40.98-111.01-100.63-212.95-175.1-302.1 46.98-18.78 93.08-18.5 131.02-12.25 31.48 5.23 60.6 15.78 90.66 27.22 24.66 9.41 48.82 17.6 73.68 16.08zm-72.08 450.75c49.73 7.36 89.29 30.57 118.86 54.84 24.67 20.26 44.59 43.96 64.93 68.91 16.64 20.48 33.47 39.66 55.76 50.78h-224.53c-.06-59.5-5.24-117.8-15.02-174.53zm-712.43-724.21c377.42 124.72 650.19 479.8 651.77 898.77h-186.75c12.37-365.98-147.3-696.31-465.02-898.77z"
          fill="#fab401"
        />
        <path
          d="m1585.91 1250.55h97.05c4.7-105.5-4.35-230.5-38.46-339.65-6.73-21.53-14.44-42.45-23.19-62.4-20.65-47.16-48.45-89.86-81.59-129.32-36.83-43.82-80.73-83.24-130.21-114.29a488.13 488.13 0 0 0 -45.37-25.26v-.02a456.484 456.484 0 0 0 -48.07-20.23l-.06-.03c-189.01-67.13-380.17-19.39-540.52 67.88-31.26 17-61.35 35.51-90 54.94-28.64 19.43-55.9 39.83-81.54 60.64h-.02l-.03.04c-30.44 24.7-68.54 58.49-106.23 98.45a933.873 933.873 0 0 0 -21.88 23.97c-19.09 21.62-48.47 51.95-39.76 83.32 6.91 24.88 38.98 17.54 50.17 8.96 17.14-9.2 35.98-23.79 52.1-37.44 21.83-18.48 42.43-38.37 64.04-57.11 87.4-75.8 178.51-134.25 268.23-173.81 19.56-8.61 39.14-16.38 58.65-23.23 19.45-6.84 38.8-12.76 57.97-17.74l.09-.02c166.97-43.39 348.41-15.27 464.58 120.94 111.91 131.22 132.34 306.87 134.05 481.41zm-1204.26-148.32c10.42-9.74 21.05-22.44 32.13-36.52 15.49-19.66 17.04-38.7 10.93-52.44-2.29-5.13-5.66-9.54-9.75-12.97-4.05-3.39-8.84-5.81-14.01-6.99-12.63-2.89-27.74 1.62-40.54 17.24-14.5 17.66-34.53 47.82-38.62 74.51-.76 5.01-.97 9.87-.45 14.43.5 4.45 1.68 8.67 3.68 12.51l.01.05.01-.01c3.27 6.27 8.78 9.57 16.12 9.85 1.53.05 3.19-.01 4.94-.21 1.73-.18 3.59-.52 5.58-.99v.01l.08-.02c9.9-2.37 19.78-9.02 29.89-18.45zm1006.79 148.32h96.26c4.57-113.7-13.74-231.15-66.59-332.76-48.06-92.44-127.52-155.28-230.38-170.47-150.16-22.16-301.68 41.42-429.77 132.42-139.47 99.07-254.6 233.6-355.21 370.81l127.15-.17c114.48-162.33 377.8-408.76 571.48-410.38 61.73-.52 124.48 13.99 170.88 55.4 33.63 30.01 74.38 88.29 72.39 135.58-1.18 28.05-26.06 36.65-49.92 27.97-18.53-6.76-31.63-23.71-44.6-41.52-42.15-57.89-107.87-86.22-179.98-76.35-86 11.77-192.6 78.57-261.36 139.32-59.3 52.41-113.72 109.76-165.08 170.14h136.71c50.11-60.5 103.02-112.11 171.03-154.5 21.54-13.41 48.04-27.6 75.9-37.17 70.28-24.18 140.23-18.06 171.27 69.5 12.21 34.42 14 64.6 10.44 119.94l-.01 2.24h92.97l.23-2.84c.07-30.29-.58-50.71 2.15-80.73 2.35-25.88 10.39-52.7 34.41-55.88 51.07-10.71 48.62 102.93 49.63 139.45zm-655.28 293.88h-75.54l-18.71 65.85h-60.2l79.65-252.17h76.3l81.9 252.17h-62.84zm-66.94-42.66h57.96c-15.21-49.25-25.06-83.05-29.55-101.38h-.75l-11.96 47.89zm-210.52 42.66h-75.54l-18.71 65.85h-60.2l79.65-252.17h76.28l81.91 252.17h-62.84zm-66.94-42.66h57.95c-15.2-49.25-25.05-83.05-29.53-101.38h-.75l-11.96 47.89zm485.36 107.38v-247.69c24.93-3.73 51.61-5.59 80.04-5.59 53.73 0 92.31 11.2 115.69 33.73 23.36 22.51 35.03 51.93 35.03 88.22 0 42.9-13.28 76.15-39.9 99.72s-67.69 35.35-123.17 35.35c-25.67 0-48.24-1.24-67.69-3.74zm57.97-206.51v164.23c3.24.75 10.23 1.14 20.95 1.14 28.78 0 51.11-7.61 66.87-22.77 15.77-15.15 23.62-36.85 23.62-65.15 0-25.95-7.17-45.71-21.56-59.3s-35.16-20.39-62.21-20.39c-11.34-.01-20.56.74-27.67 2.24zm234.82-44.53h57.97v96.89h99.1v-96.89h57.96v252.17h-57.96v-105.13h-99.1v105.13h-57.97zm425.2 186.32h-75.54l-18.71 65.85h-60.21l79.65-252.17h76.29l81.89 252.17h-62.83zm-66.94-42.66h57.95c-15.2-49.25-25.06-83.05-29.54-101.38h-.75l-11.97 47.89zm344.4 42.66h-75.54l-18.71 65.85h-60.2l79.65-252.17h76.29l81.89 252.17h-62.82zm-66.95-42.66h57.96c-15.2-49.25-25.05-83.05-29.54-101.38h-.74l-11.97 47.89zm207.9 108.51v-248.81c21.19-3.73 47.25-5.59 78.16-5.59 38.15 0 65.57 6.29 82.27 18.89 16.71 12.59 25.06 30.62 25.06 54.06 0 13.97-4.17 26.56-12.59 37.85-8.41 11.29-19.33 19.28-32.66 23.89v1.5c15.71 5.86 27.05 21.32 34.03 46.38 12.83 45.16 19.82 69.1 20.95 71.85h-59.09c-4.99-9.35-10.97-28.93-17.95-58.74-3.5-14.97-8.23-25.44-14.21-31.43-5.99-5.99-15.58-8.99-28.81-8.99h-17.94v99.15h-57.22zm57.22-209.89v69.22h23.93c14.47 0 25.86-3.31 34.22-9.87 8.35-6.55 12.53-15.33 12.53-26.43 0-11.11-3.75-19.71-11.29-25.76-7.54-6.06-18.26-9.05-32.1-9.05-13.59.01-22.68.64-27.29 1.89zm-1026.29-149.61 77.15-.24c10.14-65.2-9.69-115.38-75.6-103.42-55.56 10.1-115.23 65.31-151.28 103.42l101.72-.45c11.34-7.46 33.52-15.95 42.63-9.62 3.42 2.38 5.2 5.73 5.38 10.31zm787.23-.18.7-.03h.35c10.14.56 27.77-4.12 37.94-21.28 2.03-3.43 3.76-7.35 5.08-11.8 1.35-4.53 2.28-9.67 2.67-15.43h.02l.06-1.19c7.71-269.68-74.85-492.93-215.01-644.62-27.22-29.44-56.67-56.23-88.06-80.16-31.37-23.9-64.67-44.92-99.63-62.83v.01l-.55-.29-.02-.01c-117.82-60.23-251.43-83.37-382.6-72.25a757.862 757.862 0 0 0 -76.14 10.35c-25.18 4.71-50.18 10.75-74.78 18.01l-.34.11c-134.89 39.91-260.4 119.14-362.69 223.11a944.96 944.96 0 0 0 -56.97 63.39 951.626 951.626 0 0 0 -26.12 33.32c71.74-61.91 148.68-116.22 229.18-159.38 18.13-9.72 36.37-18.84 54.65-27.31a965.09 965.09 0 0 1 55.58-23.67l.06-.02.05-.02c71.11-27.65 141.22-45.29 211.34-53.17 70.13-7.88 140.29-6 211.54 5.33 50.72 8.07 100.2 21.35 144.79 39.94 8.64 3.59 17.17 7.43 25.5 11.47 8.22 3.98 16.31 8.24 24.25 12.71h.02l.12.06v.01c156.98 85.99 266.04 262.46 314.07 461.7 9.37 38.85 16.42 78.55 21.05 118.53 4.62 39.98 6.84 80.37 6.56 120.72v.02l-.02 2.31c.8 21.59 8.19 39.64 20.85 47.76 2.37 1.51 4.92 2.69 7.64 3.45h.02c2.79.79 5.73 1.18 8.84 1.15z"
          fill="#d32828"
        />
      </g>
    </svg>
  );
};

export default IconAadhaar;