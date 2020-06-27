<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>导出列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!--table表格部分-->
            <el-table
                    :header-cell-style="{background:'#98b0f6',color:'#526648'}"
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column type="index" label="#" :index="indexMethod"></el-table-column>
                <el-table-column prop="className" label="类名" width="180"></el-table-column>
                <el-table-column prop="requestDate" label="请求时间" width="180"></el-table-column>
                <el-table-column v-slot="scope" label="状态" width="180">
                    {{scope.row.state == '1'? '已完成':'未完成'}}
                </el-table-column>
                <el-table-column v-slot="scope" label="操作" width="180">
                    <el-button type="primary" size="small" round v-if="scope.row.state == '1'" @click="downloadFile(scope.row.filePath)">下载</el-button>
                </el-table-column>
            </el-table>

            <!--分页-->
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="userQuery.page"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        :page-size="userQuery.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                //查寻总数
                total: 0,
                tableData: [],
                userQuery: {
                    page: 1,
                    limit: 10
                }
            }
        },
        created() {
            this.getExportRecordList();
        },
        methods: {

            // 修改每页多少条
            handleSizeChange(val) {
                this.userQuery.limit = val;
                this.getExportRecordList();
            },
            // 跳转第几页
            handleCurrentChange(val) {
                this.userQuery.page = val;
                this.getExportRecordList();
            },
            indexMethod(index) {
                return index + 1;
            },

            getExportRecordList() {
                this.axios({
                    method: "POST",
                    url: "ms/export/exportRecord/getExportRecordListByPage",
                    params: this.userQuery
                }).then((res) =>{
                    this.total = res.data.data.total;
                    this.tableData = res.data.data.records;
                })
            },

            downloadFile(data) {
                let url = 'www.overun.top/soap'+data.replace('/opt/file','');
                this.axios({
                    method: 'GET',
                    url: 'soap'+data.replace('/opt/file','')
                })
            }
        }
    }
</script>

<style lang="less" scoped>

    .export_button {
        float: right;
    }
</style>
