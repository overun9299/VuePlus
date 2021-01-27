<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品爬虫</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="keyword" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getJDInfoToES"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      table表格部分-->
      <div class="view">
        <div class="product" v-for="result in tableData">
          <div class="product-iWrap" >
            <!--商品封面-->
            <div class="productImg-wrap">
              <a class="productImg">
                <img :src="result.imgUrl">
              </a>
            </div>
            <!--价格-->
            <p class="productPrice">
              <em>{{result.price}}</em>
            </p>
            <!--标题-->
            <p class="productTitle">
              <a v-html="result.title">  </a>
            </p>
          </div>
        </div>

      </div>


      <!--分页-->
      <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="GoodsQuery.page"
            :page-sizes="[12, 20, 50, 100]"
            :page-size="GoodsQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>

import "@/assets/css/goodsList.css"

export default {
  name: "goodsList",
  data() {
    return {
      //查寻总数
      total: 0,
      tableData: [],
      GoodsQuery: {
        page: 1,
        limit: 12,
        keyword:''
      },
      keyword:''
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getJDInfoToES() {
      let param = {
        keyWord:this.keyword
      }
      this.$get("/ms/search/goods/getJDInfoToES",param
                  ).then(res=>{
        console.log(res)
      })
    },

    getGoodsList() {
      this.$post("/ms/business/goods/getGoodsListByPage",this.GoodsQuery).then(res => {
        console.log(res);
        this.total = res.data.total;
        this.tableData = res.data.records;
      })
    },

    // 修改每页多少条
    handleSizeChange(val) {
      this.GoodsQuery.limit = val;
      this.getGoodsList();
    },
    // 跳转第几页
    handleCurrentChange(val) {
      this.GoodsQuery.page = val;
      this.getGoodsList();
    },
    indexMethod(index) {
      return index + 1;
    },
  }


}
</script>

<style scoped>

</style>