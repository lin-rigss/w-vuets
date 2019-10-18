<template>
  <div class="table-data">
    <!-- 搜索 -->
    <div class="search-box">
      <el-input size="small" v-model="searchVal" placeholder="请输入课程名称检索"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width:100%" :height="tHeight" class="table-box">
      <!-- 表格的每列  prop="xxx"  后面的值 就是获取后台数据中要展示 的字段名称
            count: "123"
            date: "2019-10-17"
            level: "中级"
            title: "test2"
            type: "vue"      
      -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="课程名称" prop="title"></el-table-column>
      <el-table-column width="120" label="课程等级" prop="level"></el-table-column>
      <el-table-column width="120" label="技术栈" prop="type"></el-table-column>
      <el-table-column width="120" label="报名人数" prop="count"></el-table-column>
      <el-table-column width="160" label="上线日期" prop="date"></el-table-column>

      <!-- 表格中的权限设置  ：
         1. 获取 vuex中的 用户信息获取用户的key    
         2. 使用v-if 来判断  如果这个key = visitor游客  就隐藏此编辑功能      
      -->
      <el-table-column v-if="getUser.key != 'visitor'" label="操作" width="160">
        <!-- ele  slot-scope="scope"  固定写法   -->
        <template slot-scope="scope">
          <!-- @click="handleEdit(scope.$index,scope.row)   获取当前点击的索引 和当前行的数据 -->
          <el-button @click="handleEdit(scope.$index,scope.row)" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pages" ref="page-box">
      <!--  @size-change  更改每页条数事件   -->
      <!--  @current-change  更改当前页事件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10,20]"
        :page-size="size"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 弹框组件   -->
    <EditDialog :dialogVisible="dialogVisible" :form="formData" @closeDialog="closeDialog"></EditDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import EditDialog from "./EditDialog.vue";
@Component({
  components: { EditDialog }
})
export default class TableData extends Vue {
  @Getter("user") getUser: any;

  @Provide() searchVal: string = ""; // 搜索框
  @Provide() tHeight: number = document.body.offsetHeight - 270; // 设置 可视的toble的区域  270 （上面内容 + 下面分页内容的高度）
  @Provide() tableData: any = []; // 表格数据
  @Provide() page: number = 1; // 当前page
  @Provide() size: number = 5; // 请求数据的个数 默认5
  @Provide() total: number = 0; // 总数据条数

  @Provide() dialogVisible: Boolean = false; // 控制弹窗  是否展示编辑页面
  @Provide() formData: object = {
    // 初始化 弹窗中的数据
    title: "",
    type: "",
    level: "",
    count: "",
    date: ""
  };
  // ele方法  点击编辑 执行的方法  传入的是 当前点击的索引，和当前行的数据
  handleEdit(index: number, row: any) {
    // console.log(index, row); // 点击的索引  和 数据
    this.formData = row;
    this.dialogVisible = true;
  }
  // 删除点击项 方法
  handleDelete(index: number, row: any) {
    // console.log(row._id);
    (this as any).$axios
      .delete(`/api/profiles/delete/${row._id}`)
      .then((res: any) => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
        //  将表格中 删除 点击的这一项。
        this.tableData.splice(index, 1);
      });
  }
  // 关闭弹框方法
  closeDialog() {
    this.dialogVisible = false;
  }

  created() {
    this.loadData();
  }

  // 获取表格数据  传入 分页的参数
  loadData() {
    (this as any)
      .$axios(`/api/profiles/loadMore/${this.page}/${this.size}`)
      .then((res: any) => {
        // console.log(res.data);
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      });
  }
  // 更改每页条数事件  val 是 点击传入的条数  5  10  20
  handleSizeChange(val: number): void {
    // 将 size 重新赋值
    this.size = val;
    this.page = 1;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }
  // 更改当前页事件  val 是点击的当前页
  handleCurrentChange(val: number): void {
    // 将 page 重新赋值
    this.page = val;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  // 搜索方法
  handleSearch(): void {
    // 点击搜索
    this.page = 1;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  // 搜索的方法  传参  搜索的值  page  size
  loadSearchData() {
    // 加载搜索数据
    (this as any)
      .$axios(
        `/api/profiles/search/${this.searchVal}/${this.page}/${this.size}`
      )
      .then((res: any) => {
        // console.log(res.data);
        this.tableData = res.data.datas.list;
        this.total = res.data.datas.total;
      });
  }
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  .table-box {
    font-size: 14px;
  }
  .pages {
    background: #fff;
    margin-top: 10px;
    padding: 10px 10px;
    text-align: right;
    height: 55px;
    box-sizing: border-box;
  }
  .search-box {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    height: 55px;
    box-sizing: border-box;
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>
