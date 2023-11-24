define(["backbone", "model/content", "view/content", "model/archive/detail", "model/data", "model/user/user", "view/common/season_message", "util/path", "util/language-message", "util/string"], function (a, b, c, d, e, f, g, h, i, j) {
    var k = {
        WEAPON: 1,
        SUMMON: 2,
        NPC: 3
    },
    l = {
        WEAPON: "weapon",
        SUMMON: "summon",
        NPC: "npc",
        STORY_NPC: "story_npc"
    },
    m = 0,
    n = 1,
    o = 1,
    p = c.extend({
        content_model: null,
        detail_model: null,
        events: {
            "tap .lis-lead-prev.back": "back",
            "tap .btn-enhancement": "enhancement",
            "tap .btn-evolution": "evolution",
            "tap .btn-left": "move_left",
            "tap .btn-right": "move_right",
            "tap .back-profile": "locationProfile",
            "tap .btn-char-zoom": "popZoom",
            "tap #pop-zoom .btn-close": "popZoomClose",
            "tap #pop-zoom .img-zoom": "popZoomClose",
            "touchstart #pop-zoom .prt-zoom-image": "zoomImageMove",
            "mousedown #pop-zoom .prt-zoom-image": "zoomImageMove",
            "tap .location-href:not(.disable)": "location_href"
        },
        initialize: function (a) {
            this.content_bind(),
            this.attr = a,
            this.content_model = new b({
                controller: "archive",
                action: "detail"
            }),
            this.listenToOnce(this.content_model, "change", this.render_pre),
            this.content_model.fetch(),
            this.user_model = new f,
            this.user_model.fetch()
        },
        render_pre: function () {
            this.detail_model = new d,
            this.listenToOnce(this.detail_model, "sync", this.render),
            this.content_render(this.content_model);
            var a = null,
            b = null;
            this.attr.isSolotreasure ? (this.detail_model.method = this.attr.type + "_event", a = "11" + this.attr.eventIdNum) : this.attr.isSidestory === !0 ? (this.detail_model.method = this.attr.type + "_sidestory", b = this.attr.storyId) : this.attr.isEventArchive === !0 ? (this.detail_model.method = this.attr.type + "_event", a = this.attr.eventId) : this.detail_model.method = this.attr.type,
            this.postDetail(_.defaults({
                    event_id: a,
                    story_id: b
                }, this.addInitialPostParam()))
        },
        addInitialPostParam: function () {
            return {}
        },
        postDetail: function (a) {
            var params = this.createDetailPostParam(a);
            params.forceGetURLTemplate = "/:character_id";
            return this.detail_model.save(params);
        },
        createDetailPostParam: function (a) {
            var b = _.defaults({
                user_id: this.attr.user_id,
                kind_name: this.attr.kind,
                attribute: this.attr.attribute
            }, a);
            return b[this.get_id_name()] = this.attr.param_id,
            this.createDetailPostParam = function (a) {
                return _.extend(b, a)
            },
            this.createDetailPostParam(a)
        },
        render: function () {
            var a = this.detail_model.toJSON(),
            b = [],
            c = /\[.*?\]/;
            a.another_name = "",
            "npc" != this.attr.type || _.isUndefined(a.evo_name) || _.isEmpty(a.evo_name) ? "weapon" != this.attr.type && "summon" != this.attr.type || _.isUndefined(a.series_name) || _.isEmpty(a.series_name) || (a.another_name = a.series_name) : a.another_name = c.test(a.evo_name) ? a.evo_name.match(c)[0] : null,
            _.include(["npc", "story_npc"], this.attr.type) && (this.destroySubViews(), this.seasonMessageSubView = new g({
                    model: this.detail_model
                }), this.addSubView(this.seasonMessageSubView), b = this.seasonMessageSubView.seasonMessageArray);
            var d = {
                type: this.attr.type,
                attribute: a.attribute,
                kind: a.kind,
                data: a,
                imageList: a.image_list || [],
                max_awakening_level: a.max_awakening_level,
                evolution_image: a.evolution_image,
                entry_event_list: a.entry_event_list,
                param_id: a[this.get_id_name()],
                enable_birthday_voice: a.enable_birthday_voice,
                imageSuffix: this.getCurrentImageSuffix(),
                playerUserId: this.user_model.get("user_id"),
                cosmos: a.cosmos,
                moon: a.moon,
                omega: a.omega,
                hide_attribute: a.hide_attribute,
                episodeTitle: a.episode_title || null,
                seasonMessageArray: b,
                is_arcarum: a.is_arcarum || !1,
                isFriend: a.is_friend,
                npcList: _.flatten(a.npc_list),
                npcRelationList: a.npc_relation_list,
                npcRelationListNum: _.flatten(a.npc_relation_list).length,
                UtilString: j
            };
            return void 0 != this.data_extend && this.data_extend(d),
            this.attr.user_id != this.user_model.get("user_id") && "npc" == this.attr.type && (d.entry_event_list = [], d.episode_list = [], d.other_episode.list = [], d.data.lp_rank = null),
            this.$el.find(".cnt-detail").html(_.template($("#tpl-cnt-detail").html(), d)),
            a.prev_id || this.$el.find(".btn-left").remove(),
            a.next_id || this.$el.find(".btn-right").remove(),
            this.setPageTitle(i.getMessage(this.particularTitleId || "archive_35")),
            this.updateLeadLink(),
            this.$el.find(".cnt-detail").addClass(this.attr.type),
            this.trigger("loadEnd"),
            this
        },
        getCurrentImageSuffix: function () {
            return null
        },
        updateLeadLink: function () {
            var a,
            b = this.$el.find(".prt-lead-link"),
            c = this.attr.active_tab;
            this.attr.eventKind ? a = i.getMessage("archive_57") : +c === k.WEAPON ? a = i.getMessage("archive_49") : +c === k.SUMMON ? a = i.getMessage("archive_50") : +c === k.NPC && (a = i.getMessage("archive_51")),
            this.$el.find(".lis-lead-prev.back").find(".atx-lead-link").html(a),
            1 === +this.attr.back_flg ? (b.find(".lis-lead-prev").removeAttr("data-location-href").removeClass("location-href"), b.find(".goTop").html(i.getMessage("archive_36")).addClass("back-profile")) : this.attr.isSolotreasure || this.attr.isEventArchive === !0 || this.attr.isSidestory === !0 ? this.setEventHref() : _.isUndefined(this.attr.prevHash) === !1 && this.setLeadPrevLink()
        },
        setEventHref: function () {
            var a = this.attr.isSolotreasure === !0,
            b = this.attr.isSidestory === !0,
            c = "",
            d = "",
            e = "";
            a === !0 ? c = "solotreasure" + this.attr.eventIdNum : b === !0 ? e = this.attr.storyId : (c = this.attr.eventName, d = this.attr.eventController);
            var f = {
                eventName: c,
                isSolotreasure: a,
                isSidestory: b,
                eventController: d,
                storyId: e
            };
            this.$el.find(".prt-lead-link").html(_.template($("#tpl-location-event-archive").html(), f))
        },
        setLeadPrevLink: function () {
            var a = h.replaceHashSeparator(this.attr.prevHash),
            b = {
                locationId: this.attr.locationId,
                prevHash: this.attr.prevHash,
                href: a
            };
            this.$el.find(".prt-lead-link").html(_.template($("#tpl-location-prev-hash").html(), b))
        },
        get_id_name: function () {
            return this.attr.id_prefix + "_id"
        },
        back: function () {
            var b = _.contains(["npc", "story_npc"], this.attr.type) ? "archive/npc/u_" + this.attr.user_id + "/p_" + this.attr.page : "archive/u_" + this.attr.user_id + "/" + this.attr.kind + "/" + this.attr.attribute + "/" + this.attr.page + "/" + this.attr.param_id + "/" + this.attr.active_tab + "/" + this.attr.back_flg,
            c = "",
            d = this.attr.locationId || this.attr.eventId,
            e = "";
            0 !== +this.attr.groupId && (c = "/" + this.attr.groupId),
            this.attr.eventKind && "other" !== this.attr.eventKind && (e = "/" + this.attr.eventKind),
            this.attr.eventKind && (b = "archive/story/event" + e + "/character/" + d + "/" + this.attr.back_flg + "/" + this.attr.eventCategory + "/" + this.attr.page + c),
            this.content_close(),
            a.history.navigate(b, !0)
        },
        enhancement: function () {
            this.content_close(),
            a.history.navigate("enhancement/" + this.attr.type + "/base", !0)
        },
        evolution: function () {
            this.content_close(),
            a.history.navigate("evolution/" + this.attr.type + "/base", !0)
        },
        move_left: function () {
            var b = this.setMoveHashStr("prev");
            this.content_close(),
            a.history.navigate(b, !0)
        },
        move_right: function () {
            var b = this.setMoveHashStr("next");
            this.content_close(),
            a.history.navigate(b, !0)
        },
        setMoveHashStr: function (a) {
            var b = this.detail_model.toJSON(),
            c = this.attr.type,
            d = "prev" === a ? b.prev_id : b.next_id,
            e = "archive/detail_" + c,
            f = this.attr.back_flg || null;
            ("undefined" != typeof b.prev_type || "undefined" != typeof b.next_type) && ("prev" === a ? c != b.prev_type && (c = b.prev_type) : c != b.next_type && (c = b.next_type), this.attr.isSolotreasure === !0 ? (f = this.attr.eventIdNum, e = "archive/detail_" + c + "_solotreasure") : this.attr.isSidestory === !0 ? (f = this.attr.storyId, e = "archive/detail_" + c + "_sidestory") : this.attr.isEventArchive === !0 ? (f = this.attr.eventName + "/" + this.attr.eventId + "/" + this.attr.eventController, e = "archive/detail_" + c + "_event") : e = "archive/detail_" + c);
            var g = c === l.STORY_NPC ? n : m,
            h = "undefined" !== String(this.attr.page) ? this.attr.page : o,
            i = "undefined" !== String(this.attr.active_tab) ? this.attr.active_tab : this.getActiveTab(this.attr.type);
            return e + "/" + this.attr.user_id + "/" + g + "/" + this.attr.attribute + "/" + h + "/" + d + "/" + i + "/" + f
        },
        getActiveTab: function (a) {
            switch (a) {
            case l.WEAPON:
                return k.WEAPON;
            case l.SUMMON:
                return k.SUMMON;
            case l.NPC:
            case l.STORY_NPC:
                return k.NPC
            }
        },
        locationProfile: function () {
            this.content_close(),
            a.history.navigate("profile/" + this.attr.user_id, !0)
        },
        popZoom: function (a) {
            var b = $(a.currentTarget).data("image-id");
            $(".mask").css("display", "block"),
            window.scrollTo(0, 1),
            $("#pop-zoom").html(_.template($("#tpl-char-zoom").html(), {
                    image_id: b
                }))
        },
        popZoomClose: function () {
            $("#pop-zoom").empty(),
            $(".mask").css("display", "none")
        },
        zoomImageMove: function (a) {
            if ("mousedown" === a.type && !Game.ua.isPcPlatformHasTouch)
                return void a.preventDefault();
            var b = this,
            c = $(a.currentTarget),
            d = b.$el.find(".prt-zoom-image"),
            e = function (a) {
                a.preventDefault(),
                "mousedown" === a.type ? b.touchStartX = a.originalEvent.pageX : b.touchStartX = a.originalEvent.changedTouches[0].pageX,
                b.rightStartX = d.css("right")
            },
            f = function (a) {
                a.preventDefault();
                var c;
                c = "mousemove" === a.type ? a.originalEvent.pageX : a.originalEvent.changedTouches[0].pageX;
                var e = b.touchStartX - c,
                f = b.rightStartX.replace("px", ""),
                g = Math.floor(+f + +e);
                g > 160 ? g = 160 : 0 > g && (g = 0),
                d.css("right", g + "px")
            };
            c.off(),
            "mousedown" === a.type && Game.ua.isPcPlatformHasTouch ? (e(a), c.on("mousemove", f), c.one("mouseup mouseleave", function () {
                    c.off()
                })) : "touchstart" === a.type && (e(a), c.on("touchmove", f), c.one("touchend", function () {
                    c.off()
                }))
        },
        location_href: function (b) {
            if ("true" == $(b.currentTarget).attr("disable"))
                return !1;
            var c = $(b.currentTarget).data("location-href");
            return null == c ? !1 : (this.content_close(), void a.history.navigate(c, !0))
        }
    });
    return p
});
