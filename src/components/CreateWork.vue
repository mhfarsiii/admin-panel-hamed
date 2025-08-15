<template>
  <div class="w-full flex flex-col gap-4 mt-10">
<form class="w-full flex flex-col gap-10">
  <div class="w-full flex flex-col gap-3">
    <label for="workTitle" class="text-white">
     - Work Title -
    </label>
    <input type="text" id="workTitle" placeholder="Enter Work Title" class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
  </div>
  <div class="w-full flex flex-col gap-3">
    <label for="workDescription" class="text-white">
      - Work Description -
    </label>
    <textarea id="workDescription" placeholder="Enter Work Description" class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
  </div>
  <div class="w-full flex flex-col gap-3">
    <label for="workCategory" class="text-white">
      - Category -
    </label>
    <select id="workCategory" class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500">
      <option disabled selected value="">Select Category</option>
      <option value="1">Category 1</option>
      <option value="2">Category 2</option>
      <option value="3">Category 3</option>
    </select>
  </div>
  <div class="w-full flex flex-col gap-3 items-start border-t border-white/20 pt-5">
    <label for="workImage" class="text-white bg-gray-800 p-2 rounded-md ">
      - Work Image -
    </label>
    <input type="file"  id="workImage" class="w-full p-2 rounded-md bg-gray-800 text-white" />
  </div>
  <div class="w-full flex flex-col gap-3 items-start border-t border-white/20 pt-5">
    <label for="ExtraImages" class="text-white bg-gray-800 p-2 rounded-md ">
      - Extra Images -
    </label>
    <input type="file" multiple id="ExtraImages" class="w-full p-2 rounded-md bg-gray-800 text-white" />
  </div>

  <div class="w-full flex flex-col gap-3 items-start border-t border-white/20 pt-5">
    <label for="Link" class="text-white">
      - Link -
    </label>
    <input type="text" id="Link" placeholder="https://example.com" class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
  </div>

  
  <button type="submit" class="w-full p-2 rounded-md bg-blue-500 text-white">Create Work</button>
</form>
  </div>
</template>
