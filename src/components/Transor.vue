<template>
  <div class="transor bg-primary">
    <h1 class="title text-light text-dot text-center fs-1 py-3">
      {{ robot.pose }}<br />
      參考文獻自動排序君
    </h1>
    <div class="main-section container-xxl row mx-auto">
      <div class="col-md-6 col-12 py-3">
        <form class="w-100">
          <div class="input-group">
            <select
              v-model="typeSelect"
              class="form-select text-light"
              id="typeSelect"
            >
              <option class="text-dark" value="none">--請選擇輸入格式--</option>
              <option class="text-dark" value="history">新史學格式</option>
              <option class="text-dark" value="apa">APA格式</option>
            </select>
            <button
              @click.prevent="execute"
              class="btn btn-success text-light text-dot breathing"
            >
              執行排序
            </button>
          </div>
          <textarea
            name="listInput"
            id="listInput"
            class="form-control text-light"
            v-model="input"
          ></textarea>
        </form>
      </div>
      <div class="col-md-6 col-12 py-3">
        <div class="outputField px-3 py-1 text-light" :class="{outputSuccess: output !== '', breathing: output !== ''}">
          <div class="copy">
            <button
              @click="copyText"
              class="btn text-dot btn-success btn-sm text-light"
            >
              複製結果
            </button>
          </div>
          <div v-if="output === ''" class="intro pt-5 px-3">
            <h5 class="text-dot">歡迎使用參考文獻自動排序君~</h5>
            <p class="text-dot intro-p">
              本程式為某文院碩士生有感於每次歷盡艱辛寫完報告或論文時，還要面對那如山如海的參考文獻列表，依照作者的筆畫順序一位一位的查詢排序。
              有天他論文寫不出來的時候突發奇想：要是有人能幫我的文獻自動做排序，那我論文就可以寫完了嗎？於是，他寫出了這套參考文獻自動排序君，
              希望能造福各位人文社會科學學門的各位。最終，這位研究生在夢裡寫完了他的論文，真是可喜可賀。
            </p>
            <h6>使用說明</h6>
            <ol class="text-dot">
              <li class="text-dot">請於畫面左/上側輸入框輸入欲排序內容</li>
              <li class="text-dot">請依照自身列表格式正確選填格式標準</li>
              <li class="text-dot">輸入列表各項請使用換行作為分隔，程式會依此做資料切割</li>
              <li class="text-dot">列表僅會依照每項最前端字串進行排序</li>
              <li class="text-dot">APA格式以首個括號為基準、新史學則以首個逗號為基準進行排序</li>
              <li class="text-dot">標點符號請依照格式範例使用全形</li>
              <li class="text-dot">若未依照以上規範進行操作，輸出結果將不可預期</li>
            </ol>
          </div>
          <ol v-else id="copySec" class="pt-5">
            <li v-for="(item, index) in output" :key="index">{{ item }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cnchar from "cnchar";
import "cnchar-trad";
import { SortList, DataStorage } from "../assets/classExport.js";
export default {
  name: "Transor",
  data() {
    return {
      robot: {
        face: true,
        pose: "┏(⊖皿⊖)┛",
      },
      input: "",
      output: "",
      typeSelect: "none",
    };
  },
  mounted() {
    setInterval(() => {
      if (this.robot.face) {
        this.robot.pose = "└(⊖皿⊖)┐";
        this.robot.face = false;
      } else {
        this.robot.pose = "┏(⊖皿⊖)┛";
        this.robot.face = true;
      }
    }, 1000);
  },
  methods: {
    execute() {
      if(this.input === '') {
        alert('請輸入資料');
        this.output = "";
        return
      }
      let originData = this.input.trim().split("\n");
      //get first part from the string, it's maens only get the strings before the "(" or "，";
      let type =
        this.typeSelect === "none"
          ? "none"
          : this.typeSelect === "apa"
          ? "（"
          : "，";

      if (type === "none") {
        alert("請選擇格式");
        return;
      }

      originData.unshift("0");
      //not found problem in classExport;

      let headArr = this.makeHeadArr(originData, type);
      let strokeArr = headArr.map((el) => {
        return cnchar.stroke(el, "array");
      });

      this.makeData(originData, strokeArr);

      let keyList = SortList.traversal();
      keyList.pop();
      //not found problem in classExport
      let outputList = keyList.map((el) => {
        return DataStorage.getItem(el);
      });

      this.output = outputList;
    },

    makeHeadArr(arr, type) {
      return arr.map((el) => {
        let pivot = el.indexOf(type);
        let head = el.slice(0, pivot);
        return head;
      });
    },

    makeData(origin, stroke) {
      DataStorage.clear();
      SortList.clear();

      origin.forEach((el, index) => {
        DataStorage.set(index, el);
        SortList.insert(index, stroke[index]);
      });
    },

    copyText() {
      let str = document.getElementById("copySec");
      window.getSelection().selectAllChildren(str);
      document.execCommand("Copy");
    },
  },
};
</script>

<style lang="scss">
.title {
  letter-spacing: 10px;
}

#typeSelect,
#listInput {
  background-color: transparent;

  &:focus {
    border: #20bf6b solid 1px;
    box-shadow: 0 0 3px #20bf6b, 0 0 10px #20bf6a96, inset 0 0 5px #20bf6b,
      inset 0 0 10px #20bf6a98;
  }
}

#typeSelect {
  height: 40px;
}

#listInput {
  height: 500px;
}

.outputField {
  position: relative;
  height: 540px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  overflow-y: scroll;

  .copy {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 2;
  }
}

.outputSuccess {
  border: 3px solid #20bf6b;
  box-shadow: 0 0 3px #20bf6b, 0 0 10px #20bf6a96;
}

.intro-p {
  text-indent: 44px;
  letter-spacing: 3px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  #listInput {
    height: 400px;
  }

  .outputField {
    height: 440px;
  }
}

.breathing {
  animation: breath ease-in 3s infinite;
}

@keyframes breath {
  0% {
    box-shadow: 0 0 3px #20bf6b, 0 0 10px #20bf6a96;
  }

  50% {
    box-shadow: 0 0 10px #20bf6b, 0 0 30px #20bf6b, 0 0 50px #20bf6a96;
  }

  100% {
    box-shadow: 0 0 3px #20bf6b, 0 0 10px #20bf6a96;
  }
}
</style>