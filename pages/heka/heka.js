// pages/heka/heka.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden:true,
    imagePath: "",
    name: "",
    maskHidden: true,
    background:"/images/heka2.jpg",
    pageBackgroundColor:"#ff4366",
    color:"white",
    inputwidth:"80",
    show:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // var that = this;
    // let base64 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64');
    // that.setData({
    //   'background': 'data:image/jpg;base64,' + base64
    // });
    this.createNewImg();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
    } else {
      return {
        title: '恭喜新年快乐',
        path: "",
        imageUrl:"",
        success: function (res) {
          if (res.errMsg == 'shareAppMessage:ok') {

          }
        }
      }
    }
  }, 
  secure:function(e){
    var that=this
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'msgSC',
      data: {
        text: e.detail.value||'张三'
      }
    }).then((res) => {
      console.log(res)
      if (res.result.code == "200") {
        //检测通过
        this.createNewImg(e)
      } else {
        //执行不通过
        that.setData({
          name:"",
          inputwidth: 80
        })
        wx.showToast({
          title: '包含敏感字哦。',
          icon: 'none',
          duration: 3000
        })
      }
    })
  
  },
  changewidth:function(e){
    this.setData({
      inputwidth: e.detail.value.length * 16||80
    })
  },
  setName: function (ctx){
    var that=this
    let name = this.data.name.replace(/\s+/g, "").split("").join(" ")
    ctx.font = 'bold 12px sans-serif';
    ctx.setTextAlign('center');
    ctx.textBaseline = 'middle';//文本垂直方向，基线位置 
    ctx.save();
    var discountText = name
    var bdColor = '#fb9482';
    var bdBackground = 'transparent';
    var boxHeight = 30;
    var paddingWidth=15
    let topAt = 560 * 0.778
    var boxWidth
    if (discountText == "") {
      boxWidth = ctx.measureText("张 三  敬").width + paddingWidth;
      ctx.fillText("张 三  敬", 375 / 2, topAt);
    } else {
      boxWidth = ctx.measureText(discountText+ "  敬").width + paddingWidth;
      ctx.fillText(discountText + "  敬", 375/2, topAt);
    }
    console.log(boxWidth)
    // ctx.setStrokeStyle('#fb9482')
    // ctx.strokeRect(375 / 2 - boxWidth/2, topAt - 8, boxWidth, 14)
    ctx.restore();
    ctx.stroke();
  },
  createNewImg: function (e) {
    var that = this;
    if(e && e.detail.value!=""){
      that.setData({
        name:e.detail.value,
        show:true
      })
    }
    console.log(this.data)
    var ctx = wx.createCanvasContext('share');
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    ctx.drawImage(this.data.background, 0, 0, 375, 560);
    //绘制图片
    that.setName(ctx)
    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        canvasId: 'share',
        x: 0,
        y: 0,
        width: 375,
        height: 560,
        destWidth: 5* 375, //绘制canvas的时候用的是px， 这里换算成rpx ，导出后非常清晰
        destHeight: 5* 560, //同上 px 换算成 rpx
        quality: "1.0",
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            // canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    });
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  },
  saveImageToPhotosAlbum:function(){
    let that = this
    that.setData({
      pageBackgroundColor: "white",
      color: "black"
    })
    const ctx = wx.createCanvasContext('share')
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    ctx.drawImage(this.data.background, 0, 0, 375, 560);
    that.setName(ctx)
    ctx.draw(true,function () {
      wx.canvasToTempFilePath({
          x:0,
          y: 0,
          width: 375,
          height: 560,
        destWidth: 5*375 ,
        destHeight:5*560 ,
        quality:"1.0",
          canvasId: 'share',
          success: function (saveRes) {
            that.setData({
              imagePath: saveRes.tempFilePath,
              canvasHidden:true
            });
            wx.saveImageToPhotosAlbum({
              filePath: saveRes.tempFilePath,   // 需要保存的图片地址
              success(res) {
                wx.showToast({
                  title: '图片保存中...',
                  icon: 'loading',
                  duration: 1000
                });
                setTimeout(function () {
                  wx.showToast({
                    title: '图片保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    pageBackgroundColor: "#ff4366",
                    color: "white"
                  })
                }, 1000)

              },
              fail: function (res) {
                that.setData({
                  pageBackgroundColor: "#ff4366",
                  color: "white"
                })
                if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg == "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg == "saveImageToPhotosAlbum:fail authorize no response") {
                  wx.showModal({
                    title: '提示',
                    content: '需要授权才可保存图片',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success(settingdata) {
                            if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                              wx.showToast({
                                title: '获取权限成功，再次点击可保存图片',
                                icon: 'none',
                                duration: 2000
                              })
                            } else {
                              wx.showToast({
                                title: '获取权限失败',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          },
                          fail() {
                            wx.showToast({
                              title: '获取权限失败',
                              icon: 'none',
                              duration: 2000
                            })
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
    
          }
        })

      }
    
   )

  },
  previewImg:function(){
    var that=this
    if(!that.data.show){
      wx.showToast({
        title: '请输入人名',
        icon:"none"
      })
    }else{
      var img = this.data.imagePath
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: [img] // 需要预览的图片http链接列表
        })
    }
   
  },

})