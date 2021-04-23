<template>
  <div class="app-container">
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
      <el-table-column label="部门名" width="150px" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解释说明" min-width="150px" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Comment }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdateCreate(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="departmentObj.Id > 0 ? '更新' : '创建'"
      :visible.sync="dialogDepartmentFormVisible"
    >
      <el-form
        ref="departmentObj"
        :rules="rules"
        :model="departmentObj"
        label-position="left"
        label-width="100px"
      >

        <el-form-item label="部门名" prop="Name">
          <el-input v-model="departmentObj.Name" />
        </el-form-item>
        <el-form-item label="解释说明" prop="Comment">
          <el-input v-model="departmentObj.Comment" type="textarea" />
        </el-form-item>

     
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepartmentFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="createUpdateCycle ()"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { getDepartments, createOrEditDepartment } from "@/api/departments";

export default {
  name: "DepartmentsTable",
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      departmentObj: {
        Id: 0,
        Name: null,
        Comment: null
      },
      dialogDepartmentFormVisible: false,
      textMap: {
        update: "Edit",
        create: "Create",
      },
      rules: {
        Name: [
          { required: true, message: "部门名为必须", trigger: "change" },
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // todo add param
      getDepartments().then((result) => {
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
      this.departmentObj = {
        Id: 0,
        Name: null,
        Comment: null
      };
    },
    handleUpdateCreate(row) {
      this.resetTemp();
      if(row!=null && row.Id>0){
        this.departmentObj = Object.assign({}, row); // copy obj
      }
      this.dialogDepartmentFormVisible = true;
      this.$nextTick(() => {
           this.$refs["departmentObj"].clearValidate();
      });
    },
    createUpdateCycle() {
      this.$refs["departmentObj"].validate((valid) => {
        if (valid) {
          createOrEditCycle(this.departmentObj).then((result) => {
            if (result > 0) {
              this.$notify({
                title: "成功",
                message: this.departmentObj.Id>0? "更新成功": "创建成功",
                type: "success",
                duration: 2000,
              });
              this.dialogDepartmentFormVisible = false;
              // Refresh list 
              this.getList();
            }
            else{
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
    }
  },
};
</script>
