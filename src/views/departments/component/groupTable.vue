<template>
  <div>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdateCreate"
      >
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="Id" sortable align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="小组名" prop="Name" sortable align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="该小组是否为固定工资模式"
        prop="IsFixSalary"
        sortable
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.IsFixSalary }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="分成比例"
        prop="SharePropotion"
        sortable
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.SharePropotion }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="浮动比例"
        prop="GroupVariableSharePropotion"
        sortable
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.GroupVariableSharePropotion }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="groupObj.Id > 0 ? '更新' : '创建'"
      :visible.sync="dialogGroupFormVisible"
      append-to-body
    >
      <el-form
        ref="groupObj"
        :rules="rules"
        :model="groupObj"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="小组名" prop="Name">
          <el-input v-model="groupObj.Name" />
        </el-form-item>
        <el-form-item label="部门" prop="DepartmentId">
          <el-select v-model="groupObj.DepartmentId" placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              v-bind:key="item.Id"
              v-bind:label="item.Name"
              v-bind:value="item.Id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="解释说明" prop="Comment">
          <el-input v-model="groupObj.Comment" type="textarea" />
        </el-form-item>

        <el-checkbox v-model="groupObj.IsFixSalary"
          >该小组是否为固定工资模式</el-checkbox
        >
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="createUpdateGroup()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroups, createOrEditGroup, getDepartments } from "@/api/department";

export default {
  props: {
    searchCriteria: {
      type: Object,
      default: {
        Id: null,
        DepartmentId: null,
      },
    },
  },
  data() {
    return {
      list: null,
      departmentList: null,
      listLoading: true,
      dialogGroupFormVisible: false,
      groupObj: {
        Id: 0,
        Name: null,
        DepartmentId: null,
        SharePropotion: null,
        GroupVariableSharePropotion: null,
        IsFixSalary: false,
        Comment: null,
      },
      rules: {
        Name: { required: true, message: "小组名为必须", trigger: "change" },
      },
    };
  },
  created() {
    this.getList();
    this.getDepartmentList();
  },
  mounted() {
    if (this.searchCriteria.DepartmentId != null) {
      this.groupObj.DepartmentId = this.searchCriteria.DepartmentId;
    }
  },
  methods: {
    getDepartmentList() {
      getDepartments().then((result) => {
        if (result != null && result.length > 0) {
          this.departmentList = result;
        } else {
          this.departmentList = [];
        }
      });
    },
    getList() {
      this.listLoading = true;
      // todo add param
      getGroups(this.searchCriteria).then((result) => {
        if (result != null && result.length > 0) {
          this.list = result;
        } else {
          this.list = [];
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      //this.listQuery.page = 1
      this.getList();
    },
    resetTemp() {
      var departmentId = this.groupObj.DepartmentId;
      this.groupObj = {
        Id: 0,
        Name: null,
        DepartmentId: departmentId,
        SharePropotion: null,
        GroupVariableSharePropotion: null,
        IsFixSalary: false,
        Comment: null,
      };
    },
    handleUpdateCreate(row) {
      this.resetTemp();
      if (row != null && row.Id > 0) {
        this.groupObj = Object.assign({}, row); // copy obj
      }
      this.dialogGroupFormVisible = true;
      this.$nextTick(() => {
        this.$refs["groupObj"].clearValidate();
      });
    },
    handleShowGroupList(row) {
      if (row != null && row.Id > 0) {
      }
    },
    createUpdateGroup() {
      this.$refs["groupObj"].validate((valid) => {
        if (valid) {
          createOrEditGroup(this.groupObj).then((result) => {
            if (result > 0) {
              this.$notify({
                title: "成功",
                message: this.groupObj.Id > 0 ? "更新成功" : "创建成功",
                type: "success",
                duration: 2000,
              });
              this.dialogGroupFormVisible = false;
              // Refresh list
              this.getList();
            } else {
              this.$notify({
                title: "失败",
                message: "创建失败",
                type: "fail",
                duration: 2000,
              });
            }
          });
        }
      });
    },
  },
};
</script>
